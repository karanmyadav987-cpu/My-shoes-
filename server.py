import os
import json
from http.server import SimpleHTTPRequestHandler, HTTPServer
from datetime import datetime

PORT = 8000

class MyShoesHubHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length else b'{}'

        try:
            payload = json.loads(post_data.decode('utf-8'))
        except Exception:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'success': False, 'error': 'Invalid JSON payload.'}).encode('utf-8'))
            return

        if self.path == '/api/contact':
            errors = {}
            name = payload.get('name', '').strip()
            phone = payload.get('phone', '').strip()
            interest = payload.get('interest', '').strip()
            message = payload.get('message', '').strip()

            if len(name) < 3:
                errors['name'] = 'Name must be at least 3 characters.'
            if len(phone) != 10 or not phone.isdigit():
                errors['phone'] = 'Phone must be exactly 10 digits.'
            if not interest:
                errors['interest'] = 'Interest category must be specified.'
            if len(message) < 10:
                errors['message'] = 'Message must be at least 10 characters.'

            if errors:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'errors': errors}).encode('utf-8'))
                return

            enquiries_path = os.path.join(os.getcwd(), 'enquiries.json')
            enquiries = []
            if os.path.exists(enquiries_path):
                try:
                    with open(enquiries_path, 'r', encoding='utf-8') as f:
                        enquiries = json.load(f)
                except Exception as exc:
                    print(f'Error reading enquiries file: {exc}')

            enquiries.append({
                'name': name,
                'phone': phone,
                'interest': interest,
                'message': message,
                'type': 'contact',
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            })

            with open(enquiries_path, 'w', encoding='utf-8') as f:
                json.dump(enquiries, f, indent=2, ensure_ascii=False)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'message': f'Thank you {name}! Your enquiry was stored locally.'}).encode('utf-8'))
            print(f'[API SUCCESS] Saved enquiry from {name} for {interest}.')
            return

        if self.path == '/api/sell':
            errors = {}
            bookTitle = payload.get('bookTitle', '').strip()
            author = payload.get('author', '').strip()
            condition = payload.get('condition', '').strip()
            conditionDescription = payload.get('conditionDescription', '').strip()
            proposedPriceByOwner = payload.get('proposedPriceByOwner')

            if len(bookTitle) < 3:
                errors['bookTitle'] = 'Book title must be at least 3 characters.'
            if len(author) < 3:
                errors['author'] = 'Author name must be at least 3 characters.'
            if not condition:
                errors['condition'] = 'Condition must be selected.'
            if not isinstance(proposedPriceByOwner, (int, float)) or proposedPriceByOwner <= 0:
                errors['proposedPriceByOwner'] = 'Expected price must be greater than zero.'
            if len(conditionDescription) < 10:
                errors['conditionDescription'] = 'Please add a bit more detail about the book condition.'

            if errors:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'errors': errors}).encode('utf-8'))
                return

            enquiries_path = os.path.join(os.getcwd(), 'enquiries.json')
            enquiries = []
            if os.path.exists(enquiries_path):
                try:
                    with open(enquiries_path, 'r', encoding='utf-8') as f:
                        enquiries = json.load(f)
                except Exception as exc:
                    print(f'Error reading enquiries file: {exc}')

            enquiries.append({
                'bookTitle': bookTitle,
                'author': author,
                'condition': condition,
                'conditionDescription': conditionDescription,
                'proposedPriceByOwner': proposedPriceByOwner,
                'type': 'sell',
                'status': payload.get('status', 'PENDING'),
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            })

            with open(enquiries_path, 'w', encoding='utf-8') as f:
                json.dump(enquiries, f, indent=2, ensure_ascii=False)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True, 'message': 'Buy-back request recorded successfully.'}).encode('utf-8'))
            print(f'[API SUCCESS] Saved shoe buy-back request for {bookTitle}.')
            return

        self.send_response(404)
        self.end_headers()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        super().end_headers()

if __name__ == '__main__':
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, MyShoesHubHandler)
    print('\n=======================================================')
    print('  My Books HUB Local Development Server Active')
    print(f'  Url: http://localhost:{PORT}')
    print('  Press Ctrl+C to shut down')
    print('=======================================================\n')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nStopping server...')
        httpd.server_close()
        print('Server stopped.')
