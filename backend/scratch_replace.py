import os
import re

directory = "c:/Users/Admin/Desktop/Mini Project/bridge-pro/src"
target = "http://localhost:8000"

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(".jsx") or file.endswith(".tsx"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            
            if target in content:
                # Add const declaration if not there
                if "const API_BASE_URL" not in content:
                    lines = content.split("\n")
                    # Insert after imports
                    for i, line in enumerate(lines):
                        if not line.startswith("import "):
                            lines.insert(i, 'const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";')
                            break
                    content = "\n".join(lines)
                
                # Replace single quotes
                content = re.sub(r"'http://localhost:8000(.*?)'", r"`${API_BASE_URL}\1`", content)
                # Replace double quotes
                content = re.sub(r'"http://localhost:8000(.*?)"', r"`${API_BASE_URL}\1`", content)
                # Replace backticks
                content = re.sub(r"`http://localhost:8000(.*?)`", r"`${API_BASE_URL}\1`", content)
                
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Updated {file}")
