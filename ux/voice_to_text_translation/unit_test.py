import unittest
from unittest.mock import patch, MagicMock
from app import get_endpoint, check_health, transcribe_audio, translate_text, text_to_speech
import requests

class TestApp(unittest.TestCase):

    def test_get_endpoint(self):
        # Test online GPU endpoint
        self.assertEqual(get_endpoint(True, False, "asr"), "https://gaganyatri-asr-indic-server.hf.space")
        # Test localhost GPU endpoint
        self.assertEqual(get_endpoint(True, True, "asr"), "http://localhost:8860")
        # Test online CPU endpoint
        self.assertEqual(get_endpoint(False, False, "asr"), "https://gaganyatri-asr-indic-server-cpu.hf.space")
        # Test localhost CPU endpoint
        self.assertEqual(get_endpoint(False, True, "asr"), "http://localhost:8860")

    @patch('app.requests.get')
    def test_check_health_success(self, mock_get):
        mock_response = MagicMock()
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        self.assertTrue(check_health(True, False))
        self.assertTrue(check_health(True, True))
        self.assertTrue(check_health(False, False))
        self.assertTrue(check_health(False, True))

    @patch('app.requests.get')
    def test_check_health_failure(self, mock_get):
        mock_get.side_effect = requests.exceptions.RequestException

        self.assertFalse(check_health(True, False))
        self.assertFalse(check_health(True, True))
        self.assertFalse(check_health(False, False))
        self.assertFalse(check_health(False, True))

    @patch('app.requests.post')
    def test_transcribe_audio_success(self, mock_post):
        mock_response = MagicMock()
        mock_response.json.return_value = {'text': 'transcription'}
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response

        self.assertEqual(transcribe_audio('audio_path', True, False), 'transcription')

    @patch('app.requests.post')
    def test_transcribe_audio_failure(self, mock_post):
        mock_post.side_effect = requests.exceptions.RequestException

        self.assertEqual(transcribe_audio('audio_path', True, False), '')

    @patch('app.requests.post')
    def test_translate_text_success(self, mock_post):
        mock_response = MagicMock()
        mock_response.json.return_value = {'translations': ['translation']}
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response

        self.assertEqual(translate_text('transcription', True, False), {'translations': ['translation']})

    @patch('app.requests.post')
    def test_translate_text_failure(self, mock_post):
        mock_post.side_effect = requests.exceptions.RequestException

        self.assertEqual(translate_text('transcription', True, False), {'translations': ['']})

    @patch('app.requests.post')
    def test_text_to_speech_success(self, mock_post):
        mock_response = MagicMock()
        mock_response.content = b'audio_data'
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response

        audio_path, success = text_to_speech('translated_text', True, False)
        self.assertEqual(audio_path, 'translated_audio.wav')
        self.assertEqual(success, 'Yes')

    @patch('app.requests.post')
    def test_text_to_speech_failure(self, mock_post):
        mock_post.side_effect = requests.exceptions.RequestException

        audio_path, success = text_to_speech('translated_text', True, False)
        self.assertIsNone(audio_path)
        self.assertEqual(success, 'No')

if __name__ == '__main__':
    unittest.main()