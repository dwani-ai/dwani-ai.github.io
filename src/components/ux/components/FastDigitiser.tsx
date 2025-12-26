import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Drawer,
  IconButton,
} from '@mui/material';
import {
  Send as SendIcon,
  Menu as MenuIcon,
  UploadFile as UploadFileIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Delete as DeleteIcon,
  Language as LanguageIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  Description as DescriptionIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import Highlight from 'react-highlight-words';

const API_BASE = import.meta.env.VITE_DWANI_API_BASE_URL || 'https://discovery-server.dwani.ai';
const API_KEY = import.meta.env.VITE_DWANI_API_KEY;
const STORAGE_KEY = 'dwani_conversations';
const GLOBAL_CHAT_ID = 'global-all-documents';

interface UploadedFile {
  file_id: string;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

interface LocalUpload {
  file: File;
  progress: number;
  status: 'uploading' | 'pending' | 'failed';
  file_id?: string;
  error?: string;
}

interface Source {
  filename: string;
  page: string;
  excerpt: string;
  relevance_score: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

interface Conversation {
  id: string;
  fileIds: string[];
  filenames: string[];
  messages: Message[];
  lastUpdated: number;
  preview: string;
  isGlobal?: boolean;
}

// ======================= Custom Hook: useDocumentManager =======================

const useDocumentManager = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [localUploads, setLocalUploads] = useState<LocalUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const uploadQueueRef = useRef<File[]>([]);

  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/files/`, {
        headers: { 'X-API-KEY': API_KEY || '' },
      });
      if (res.ok) {
        const data: UploadedFile[] = await res.json();
        setUploadedFiles(data);
      }
    } catch (err) {
      console.error('Failed to fetch files');
    }
  }, []);

  useEffect(() => {
    fetchFiles();
    const interval = setInterval(fetchFiles, 5000);
    return () => clearInterval(interval);
  }, [fetchFiles]);

  const uploadNext = useCallback(async () => {
    if (uploadQueueRef.current.length === 0) {
      setIsUploading(false);
      return;
    }

    setIsUploading(true);
    const file = uploadQueueRef.current.shift()!;

    setLocalUploads(prev => [...prev, { file, progress: 0, status: 'uploading' as const }]);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE}/files/upload`, {
        method: 'POST',
        headers: { 'X-API-KEY': API_KEY || '', accept: 'application/json' },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Upload failed');
      }

      const data = await res.json();

      setLocalUploads(prev =>
        prev.map(u =>
          u.file === file ? { ...u, file_id: data.file_id, status: 'pending' as const, progress: 100 } : u
        )
      );
    } catch (err) {
      setLocalUploads(prev =>
        prev.map(u =>
          u.file === file
            ? { ...u, status: 'failed' as const, error: (err as Error).message }
            : u
        )
      );
    } finally {
      setLocalUploads(prev => prev.filter(u => u.file !== file));
      uploadNext();
    }
  }, []);

  const enqueueUploads = (files: FileList | null) => {
    if (!files) return;
    const pdfs = Array.from(files).filter(f => f.type === 'application/pdf');
    if (pdfs.length === 0) return;

    uploadQueueRef.current = [...uploadQueueRef.current, ...pdfs];
    setLocalUploads(prev => [
      ...prev,
      ...pdfs.map(f => ({ file: f, progress: 0, status: 'uploading' as const })),
    ]);
    if (!isUploading) uploadNext();
  };

  const deleteFiles = async (fileIds: string[]) => {
    const results = await Promise.all(
      fileIds.map(id =>
        fetch(`${API_BASE}/files/${id}`, {
          method: 'DELETE',
          headers: { 'X-API-KEY': API_KEY || '' },
        })
      )
    );

    const failed = results.filter(r => !r.ok);
    if (failed.length > 0) alert(`${failed.length} file(s) failed to delete.`);

    setUploadedFiles(prev => prev.filter(f => !fileIds.includes(f.file_id)));
  };

  const downloadMergedPdf = async (fileIds: string[]) => {
    if (fileIds.length === 0) return;

    try {
      const res = await fetch(`${API_BASE}/files/merge-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-KEY': API_KEY || '' },
        body: JSON.stringify({ file_ids: fileIds }),
      });

      if (!res.ok) throw new Error('Failed to generate merged PDF');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        fileIds.length === 1
          ? `clean_${uploadedFiles.find(f => f.file_id === fileIds[0])?.filename || 'document.pdf'}`
          : `merged_clean_${fileIds.length}_docs.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to generate merged PDF');
    }
  };

  const downloadSinglePdf = async (fileId: string, filename: string) => {
    try {
      const res = await fetch(`${API_BASE}/files/${fileId}/pdf`, {
        headers: { 'X-API-KEY': API_KEY || '' },
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clean_${filename}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download cleaned PDF');
    }
  };

  return {
    uploadedFiles,
    localUploads,
    isUploading,
    enqueueUploads,
    deleteFiles,
    downloadMergedPdf,
    downloadSinglePdf,
    refetch: fetchFiles,
  };
};

// ======================= Custom Hook: useChat =======================

const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConvId, setCurrentConvId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [activeFileIds, setActiveFileIds] = useState<string[]>([]);
  const [activeFilenames, setActiveFilenames] = useState<string[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: Conversation[] = JSON.parse(saved);
        setConversations(parsed.sort((a, b) => b.lastUpdated - a.lastUpdated));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  const openChat = (fileIds: string[], filenames: string[], isGlobal = false) => {
    if (fileIds.length === 0) return;
    const id = isGlobal ? GLOBAL_CHAT_ID : fileIds.sort().join('|');
    const existing = conversations.find(c => c.id === id);

    setActiveFileIds(fileIds);
    setActiveFilenames(filenames);
    setCurrentConvId(id);
    setChatOpen(true);

    if (existing) {
      setChatHistory(existing.messages);
    } else {
      const welcome: Message = {
        role: 'assistant',
        content: isGlobal
          ? `**Global Chat** loaded with **${fileIds.length}** document${fileIds.length > 1 ? 's' : ''}.\n\nAsk me anything across your library!`
          : `Loaded **${fileIds.length}** document${fileIds.length > 1 ? 's' : ''}: ${filenames.join(', ')}\n\nAsk me anything!`,
      };
      setChatHistory([welcome]);
      setConversations(prev => [
        { id, fileIds, filenames, messages: [welcome], lastUpdated: Date.now(), preview: welcome.content.slice(0, 60) + '...', isGlobal },
        ...prev.filter(c => c.id !== id),
      ]);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || loading || activeFileIds.length === 0) return;

    const userMsg: Message = { role: 'user', content: message.trim() };
    setChatHistory(prev => [...prev, userMsg, { role: 'assistant', content: '' }]);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/chat-with-document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-KEY': API_KEY || '' },
        body: JSON.stringify({
          file_ids: activeFileIds,
          messages: [...chatHistory, userMsg],
        }),
      });

      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || 'Chat failed');

      const data = await res.json();
      setChatHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: data.answer?.trim() || 'No response.',
          sources: data.sources || [],
        };
        return updated;
      });

      setConversations(prev => {
        const filtered = prev.filter(c => c.id !== currentConvId);
        const preview = data.answer.slice(0, 60) + '...';
        return [
          {
            id: currentConvId!,
            fileIds: activeFileIds,
            filenames: activeFilenames,
            messages: chatHistory.slice(0, -1).concat({
              role: 'assistant',
              content: data.answer,
              sources: data.sources,
            }),
            lastUpdated: Date.now(),
            preview,
            isGlobal: currentConvId === GLOBAL_CHAT_ID,
          },
          ...filtered,
        ];
      });
    } catch (err) {
      setError((err as Error).message);
      setChatHistory(prev => prev.slice(0, -2));
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (!currentConvId) return;
    setConversations(prev => prev.filter(c => c.id !== currentConvId));
    const welcome = chatHistory[0];
    setChatHistory([welcome]);
  };

  const closeChat = () => setChatOpen(false);

  return {
    conversations,
    chatOpen,
    chatHistory,
    loading,
    error,
    activeFilenames,
    currentConvId,
    openChat,
    sendMessage,
    clearChat,
    closeChat,
    setError,
  };
};

// ======================= Main Component =======================

export default function Digitiser() {
  const {
    uploadedFiles,
    localUploads,
    isUploading,
    enqueueUploads,
    deleteFiles,
    downloadMergedPdf,
    downloadSinglePdf,
  } = useDocumentManager();

  const {
    conversations,
    chatOpen,
    chatHistory,
    loading: chatLoading,
    error: chatError,
    activeFilenames,
    currentConvId,
    openChat,
    sendMessage,
    clearChat,
    closeChat,
    setError: setChatError,
  } = useChat();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearChatDialogOpen, setClearChatDialogOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [filesToDelete, setFilesToDelete] = useState<string[]>([]);

  // Deduplicated file list with proper type handling
  const serverFileMap = new Map<string, UploadedFile>();
  uploadedFiles.forEach(f => serverFileMap.set(f.file_id, f));

  const pendingLocalUploads = localUploads.filter(u => !u.file_id || !serverFileMap.has(u.file_id));

  type TableFile = {
    file_id: string;
    filename: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'uploading';
    created_at: string;
    source: 'server' | 'local';
    error?: string;
  };

  const allFiles: TableFile[] = [
    ...uploadedFiles.map(f => ({
      file_id: f.file_id,
      filename: f.filename,
      status: f.status,
      created_at: f.created_at,
      source: 'server' as const,
    })),
    ...pendingLocalUploads.map((u, index) => ({
      file_id: u.file_id || `local-${u.file.name}-${u.file.size}-${index}`,
      filename: u.file.name,
      status: u.status,
      created_at: new Date().toISOString(),
      source: 'local' as const,
      error: u.error,
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const completedFiles = allFiles.filter(f => f.status === 'completed');
  const selectedCompleted = completedFiles.filter(f => selectedFileIds.has(f.file_id));

  const formatDate = (date: string) => new Date(date).toLocaleString();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'failed': return 'error';
      default: return 'warning';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'uploading': return 'Uploading';
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'completed': return 'Ready';
      case 'failed': return 'Failed';
      default: return status;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: { xs: 2, md: 4 } }}>
      <Stack spacing={4} sx={{ maxWidth: 1300, mx: 'auto' }}>
        {/* Header */}
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h5">dwani.ai – Document Intelligence</Typography>
        </Stack>

        {/* Selection Actions */}
        {selectedFileIds.size > 0 && (
          <Alert severity="info" action={
            <Stack direction="row" spacing={1}>
              <Button
                startIcon={<PictureAsPdfIcon />}
                onClick={() => downloadMergedPdf(Array.from(selectedFileIds))}
                disabled={selectedCompleted.length === 0}
              >
                Merge PDF ({selectedCompleted.length})
              </Button>
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                onClick={() => {
                  setFilesToDelete(Array.from(selectedFileIds));
                  setDeleteDialogOpen(true);
                }}
              >
                Delete ({selectedFileIds.size})
              </Button>
              <Button
                onClick={() => openChat(selectedCompleted.map(f => f.file_id), selectedCompleted.map(f => f.filename))}
                disabled={selectedCompleted.length === 0}
              >
                Chat ({selectedCompleted.length})
              </Button>
            </Stack>
          }>
            {selectedFileIds.size} document{selectedFileIds.size > 1 ? 's' : ''} selected
          </Alert>
        )}

        {/* Documents Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Your Documents ({allFiles.length})</Typography>
          <Button
            variant="contained"
            startIcon={<LanguageIcon />}
            onClick={() => openChat(completedFiles.map(f => f.file_id), completedFiles.map(f => f.filename), true)}
            disabled={completedFiles.length === 0}
          >
            Global Chat ({completedFiles.length})
          </Button>
        </Box>

        {/* Documents Table */}
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell><strong>Filename</strong></TableCell>
                <TableCell><strong>Uploaded</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allFiles.length === 0 && !isUploading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10, color: 'text.secondary' }}>
                    <Typography variant="h6">No documents yet</Typography>
                    <Typography>Click "Select PDFs" below to upload your first documents.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                allFiles.map((file) => (
                  <TableRow key={file.file_id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedFileIds.has(file.file_id)}
                        onChange={(e) => {
                          const set = new Set(selectedFileIds);
                          e.target.checked ? set.add(file.file_id) : set.delete(file.file_id);
                          setSelectedFileIds(set);
                        }}
                        disabled={file.status !== 'completed'}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={file.filename}>
                        <Typography noWrap sx={{ maxWidth: 360 }}>
                          {file.filename}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{formatDate(file.created_at)}</TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Chip
                          label={getStatusLabel(file.status)}
                          color={getStatusColor(file.status)}
                          size="small"
                        />
                        {file.source === 'local' && file.status === 'uploading' && <LinearProgress />}
                        {file.source === 'local' && file.error && (
                          <Typography variant="caption" color="error">{file.error}</Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          startIcon={<DescriptionIcon />}
                          onClick={() => openChat([file.file_id], [file.filename])}
                          disabled={file.status !== 'completed'}
                        >
                          {file.status === 'completed' ? 'Chat' : 'Processing...'}
                        </Button>

                        {file.status === 'completed' && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<DownloadIcon />}
                              onClick={() => downloadSinglePdf(file.file_id, file.filename)}
                            >
                              Download
                            </Button>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                setFilesToDelete([file.file_id]);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />

        {/* Upload Section */}
        <Stack spacing={2}>
          <Typography variant="h6">Upload Documents</Typography>
          <input
            type="file"
            accept="application/pdf"
            multiple
            hidden
            id="pdf-upload"
            onChange={(e) => enqueueUploads(e.target.files)}
          />
          <label htmlFor="pdf-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<UploadFileIcon />}
              disabled={isUploading}
              size="large"
            >
              {isUploading ? 'Uploading...' : 'Select PDFs'}
            </Button>
          </label>
          {localUploads.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              {localUploads.length} file(s) in queue...
            </Typography>
          )}
        </Stack>

        {/* Chat Dialog */}
        <Dialog open={chatOpen} onClose={closeChat} maxWidth="md" fullWidth>
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                {currentConvId === GLOBAL_CHAT_ID
                  ? `Global Chat • ${activeFilenames.length} documents`
                  : activeFilenames.length === 1
                    ? activeFilenames[0]
                    : `${activeFilenames.length} documents`}
              </Typography>
              <Button
                startIcon={<ClearIcon />}
                onClick={() => setClearChatDialogOpen(true)}
                variant="outlined"
                size="small"
              >
                Clear
              </Button>
            </Stack>
          </DialogTitle>
          <DialogContent dividers sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <Box flex={1} overflow="auto" p={2} component={Paper} variant="outlined">
              <List>
                {chatHistory.map((msg, i) => (
                  <ListItem key={i} alignItems="flex-start">
                    <Paper
                      sx={{
                        p: 2,
                        maxWidth: '80%',
                        bgcolor: msg.role === 'user' ? 'primary.light' : 'grey.100',
                        color: msg.role === 'user' ? 'white' : 'inherit',
                      }}
                    >
                      <Typography variant="subtitle2" gutterBottom>
                        {msg.role === 'user' ? 'You' : 'Assistant'}
                      </Typography>
                      <Typography whiteSpace="pre-wrap">{msg.content || 'Thinking...'}</Typography>

                      {msg.sources && msg.sources.length > 0 && (
                        <Accordion sx={{ mt: 2 }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="caption" fontWeight="medium">
                              Sources ({msg.sources.length})
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Stack spacing={2}>
                              {msg.sources.map((source, idx) => {
                                const fileRecord = allFiles.find(
                                  f => f.filename === source.filename && f.status === 'completed'
                                );

                                const pageMatch = source.page.match(/\d+/);
                                const firstPage = pageMatch ? parseInt(pageMatch[0]) : 1;

                                const pdfUrl = fileRecord
                                  ? `${API_BASE}/files/${fileRecord.file_id}/pdf#page=${firstPage}`
                                  : null;

                                return (
                                  <Box key={idx}>
                                    <Typography variant="caption" gutterBottom>
                                      {pdfUrl ? (
                                        <a
                                          href={pdfUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            color: '#1976d2',
                                            textDecoration: 'underline',
                                            fontWeight: 'bold',
                                          }}
                                        >
                                          {source.filename} — {source.page}
                                        </a>
                                      ) : (
                                        <strong>
                                          {source.filename} — {source.page || 'Unknown page'}
                                        </strong>
                                      )}{' '}
                                      <span style={{ color: '#666' }}>
                                        (relevance: {source.relevance_score.toFixed(2)})
                                      </span>
                                    </Typography>
                                    <Paper variant="outlined" sx={{ p: 1.5, mt: 0.5, bgcolor: 'grey.50' }}>
                                      <Highlight
                                        highlightClassName="source-highlight"
                                        searchWords={userMessage.split(' ').filter(w => w.length > 3)}
                                        textToHighlight={source.excerpt}
                                        autoEscape
                                      />
                                    </Paper>
                                  </Box>
                                );
                              })}
                            </Stack>
                          </AccordionDetails>
                        </Accordion>
                      )}
                    </Paper>
                  </ListItem>
                ))}
                {chatLoading && (
                  <ListItem>
                    <CircularProgress size={24} />
                    <Typography sx={{ ml: 2 }}>Searching and thinking...</Typography>
                  </ListItem>
                )}
              </List>
            </Box>

            {chatError && (
              <Alert severity="error" onClose={() => setChatError(null)} sx={{ mt: 2 }}>
                {chatError}
              </Alert>
            )}

            <Stack direction="row" spacing={1} mt={2}>
              <TextField
                fullWidth
                multiline
                maxRows={5}
                placeholder="Ask about your documents..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(userMessage);
                    setUserMessage('');
                  }
                }}
                disabled={chatLoading}
              />
              <Button
                variant="contained"
                onClick={() => {
                  sendMessage(userMessage);
                  setUserMessage('');
                }}
                disabled={chatLoading || !userMessage.trim()}
                sx={{ height: 56 }}
              >
                <SendIcon />
              </Button>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeChat}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Permanently delete {filesToDelete.length} document{filesToDelete.length > 1 ? 's' : ''}?
              This cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => {
                deleteFiles(filesToDelete);
                setSelectedFileIds(new Set());
                setDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Clear Chat Confirmation */}
        <Dialog open={clearChatDialogOpen} onClose={() => setClearChatDialogOpen(false)}>
          <DialogTitle>Clear Conversation?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This will reset the chat while keeping the loaded documents.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setClearChatDialogOpen(false)}>Cancel</Button>
            <Button
              color="warning"
              variant="contained"
              onClick={() => {
                clearChat();
                setClearChatDialogOpen(false);
              }}
            >
              Clear Chat
            </Button>
          </DialogActions>
        </Dialog>

        {/* Conversations Drawer */}
        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 340, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Conversations ({conversations.length})
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {conversations.filter(c => c.isGlobal).length > 0 && (
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      const comp = allFiles.filter(f => f.status === 'completed');
                      openChat(comp.map(f => f.file_id), comp.map(f => f.filename), true);
                      setDrawerOpen(false);
                    }}
                    sx={{ borderRadius: 2, bgcolor: 'primary.main', color: 'white', mb: 2 }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
                        <LanguageIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Global Chat"
                      secondary={`${completedFiles.length} documents`}
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                    />
                  </ListItemButton>
                </ListItem>
              )}
              {conversations.filter(c => !c.isGlobal).map((conv) => (
                <ListItem key={conv.id} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      openChat(conv.fileIds, conv.filenames);
                      setDrawerOpen(false);
                    }}
                    sx={{ borderRadius: 2, mb: 1 }}
                  >
                    <ListItemAvatar>
                      <Avatar><DescriptionIcon /></Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${conv.filenames.length} document${conv.filenames.length > 1 ? 's' : ''}`}
                      secondary={conv.preview}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Stack>
    </Box>
  );
}