import requests
import os

def test_text_only():
    resp = requests.post('http://localhost:5000/posts/', data={
        'user_id': 1,
        'content': 'Text-only post!'
    })
    assert resp.status_code == 201, f"Text-only post failed: {resp.text}"
    print('✅ Text-only post: PASSED')

def test_text_image():
    with open('test_image.jpg', 'rb') as img:
        resp = requests.post('http://localhost:5000/posts/',
            data={'user_id': 1, 'content': 'Post with image!'},
            files={'media': img})
    assert resp.status_code == 201, f"Image post failed: {resp.text}"
    print('✅ Text+image post: PASSED')

def test_text_video():
    # You must provide a small test video file named test_video.mp4
    if not os.path.exists('test_video.mp4'):
        print('⚠️  Skipping video test (test_video.mp4 not found)')
        return
    with open('test_video.mp4', 'rb') as vid:
        resp = requests.post('http://localhost:5000/posts/',
            data={'user_id': 1, 'content': 'Post with video!'},
            files={'media': vid})
    assert resp.status_code == 201, f"Video post failed: {resp.text}"
    print('✅ Text+video post: PASSED')

def test_invalid_filetype():
    with open('test_profile.py', 'rb') as f:
        resp = requests.post('http://localhost:5000/posts/',
            data={'user_id': 1, 'content': 'Invalid file type!'},
            files={'media': ('test.txt', f, 'text/plain')})
    assert resp.status_code == 400, f"Invalid filetype should fail: {resp.text}"
    print('✅ Invalid filetype: PASSED')

def test_large_file():
    # Create a dummy large file if not exists
    fname = 'large_test_file.jpg'
    if not os.path.exists(fname):
        with open(fname, 'wb') as f:
            f.write(os.urandom(11 * 1024 * 1024))  # 11MB
    with open(fname, 'rb') as f:
        resp = requests.post('http://localhost:5000/posts/',
            data={'user_id': 1, 'content': 'Large file!'},
            files={'media': f})
    assert resp.status_code == 400, f"Large file should fail: {resp.text}"
    print('✅ Large file: PASSED')

def test_missing_content():
    resp = requests.post('http://localhost:5000/posts/', data={'user_id': 1})
    assert resp.status_code == 400, f"Missing content should fail: {resp.text}"
    print('✅ Missing content: PASSED')

def run_all():
    test_text_only()
    test_text_image()
    test_text_video()
    test_invalid_filetype()
    test_large_file()
    test_missing_content()
    print('\nAll tests completed.')

if __name__ == '__main__':
    run_all() 