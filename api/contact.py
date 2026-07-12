#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# My Shoes Hub - CGI Script for Form Submissions

import sys
import os
import json
from datetime import datetime

def respond_json(data, status=200):
    """Sends JSON response to CGI channel"""
    if status == 200:
        print("Status: 200 OK")
    elif status == 400:
        print("Status: 400 Bad Request")
    elif status == 500:
        print("Status: 500 Internal Server Error")
        
    print("Content-Type: application/json")
    print("Access-Control-Allow-Origin: *")
    print("") # Blank line required to split headers from body
    print(json.dumps(data, ensure_ascii=False))

def main():
    if os.environ.get('REQUEST_METHOD', 'GET') != 'POST':
        respond_json({"success": False, "error": "Only POST requests are supported."}, 400)
        return

    try:
        # Read payload size
        try:
            content_length = int(os.environ.get('CONTENT_LENGTH', 0))
        except ValueError:
            content_length = 0

        if content_length == 0:
            respond_json({"success": False, "error": "Empty body payload."}, 400)
            return

        # Load post data
        post_data = sys.stdin.read(content_length)
        data = json.loads(post_data)

        # Extraction and cleaning
        name = data.get('name', '').strip()
        phone = data.get('phone', '').strip()
        interest = data.get('interest', '').strip()
        message = data.get('message', '').strip()

        # Zod-like server-side validation check
        errors = {}
        if not name or len(name) < 3:
            errors['name'] = "Name must be at least 3 characters."
        if not phone or not phone.isdigit() or len(phone) != 10:
            errors['phone'] = "Phone must be exactly 10 digits."
        if not interest:
            errors['interest'] = "Interest field is required."
        if not message or len(message) < 10:
            errors['message'] = "Message must be at least 10 characters."

        if errors:
            respond_json({"success": False, "errors": errors}, 400)
            return

        # Storage directory
        storage_file = os.path.join(os.path.dirname(__file__), '..', 'enquiries.json')
        enquiries = []

        if os.path.exists(storage_file):
            try:
                with open(storage_file, 'r', encoding='utf-8') as f:
                    enquiries = json.load(f)
            except Exception:
                pass

        new_record = {
            "name": name,
            "phone": phone,
            "interest": interest,
            "message": message,
            "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        enquiries.append(new_record)

        # Write to JSON
        with open(storage_file, 'w', encoding='utf-8') as f:
            json.dump(enquiries, f, indent=2, ensure_ascii=False)

        respond_json({"success": True, "message": "Enquiry registered successfully."}, 200)

    except Exception as e:
        respond_json({"success": False, "error": f"Failed to parse entry: {str(e)}"}, 500)

if __name__ == '__main__':
    main()
