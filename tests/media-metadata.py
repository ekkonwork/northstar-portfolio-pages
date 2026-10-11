"""Catch ancillary chunks that ordinary image-library info omits."""
import io
from pathlib import Path
import struct
import sys
import unittest
import zlib
from PIL import Image
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from check_media_metadata import check


class MetadataTests(unittest.TestCase):
    def image(self):
        output=io.BytesIO();Image.new('RGB',(8,8),(70,100,130)).save(output,format='PNG')
        return output.getvalue()

    def test_clean_image(self):check(self.image())

    def test_hidden_provenance(self):
        data=self.image();kind=b'caBX';payload=b'test provenance'
        chunk=struct.pack('>I',len(payload))+kind+payload+struct.pack('>I',zlib.crc32(kind+payload)&0xffffffff)
        with self.assertRaises(ValueError):check(data[:-12]+chunk+data[-12:])

    def test_appended_data(self):
        with self.assertRaises(ValueError):check(self.image()+b'test payload')


if __name__=='__main__':unittest.main()
