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

    def sample(self,format,**options):
        output=io.BytesIO();Image.new('RGB',(8,8),(70,100,130)).save(output,format=format,**options)
        return output.getvalue()

    def test_clean_jpeg_and_gif(self):
        for data in (self.sample('JPEG'),self.sample('JPEG',progressive=True),self.sample('GIF',loop=0)):
            check(data)

    def test_hidden_jpeg_application_block(self):
        data=self.sample('JPEG');payload=b'test provenance'
        segment=b'\xff\xeb'+struct.pack('>H',len(payload)+2)+payload
        for marked in (data[:2]+segment+data[2:],data[:-2]+segment+data[-2:]):
            with self.assertRaises(ValueError):check(marked)

    def test_jpeg_and_gif_appended_data(self):
        for format in ('JPEG','GIF'):
            with self.assertRaises(ValueError):check(self.sample(format)+b'test payload')

    def test_unknown_gif_application_block(self):
        data=self.sample('GIF');extension=b'\x21\xff\x0bPRIVATEDATA\x04test\x00'
        with self.assertRaises(ValueError):check(data[:-1]+extension+data[-1:])


if __name__=='__main__':unittest.main()
