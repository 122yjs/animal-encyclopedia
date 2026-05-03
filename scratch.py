with open("docs/ROADMAP.md", "r") as f:
    lines = f.readlines()

start_idx = 70
end_idx = 86
print("--- TARGET CONTENT ---")
print("".join(lines[start_idx:end_idx]))
print("--- END TARGET CONTENT ---")
