with open('src/app/App.tsx', 'rb') as f:
    content = f.read()

lines = content.split(b'\n')
for i in range(899, 908):
    line = lines[i]
    print(f'Line {i+1}: {line.hex()}')
    print(f'      : {line.decode("utf-8", errors="replace")}')