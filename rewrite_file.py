with open('src/app/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove BOM if present
if content.startswith('\ufeff'):
    content = content[1:]

# Write back with proper encoding
with open('src/app/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('File rewritten successfully')