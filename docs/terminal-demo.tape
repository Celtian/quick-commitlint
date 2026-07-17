Output docs/assets/terminal-demo.gif

Set Shell bash
Set Width 1200
Set Height 720
Set FontSize 20
Set TypingSpeed 25ms
Set Framerate 24
Set CursorBlink false
Set Theme "Catppuccin Frappe"
Set Padding 20
Set Margin 20
Set MarginFill "#303446"
Set WindowBar Colorful
Set BorderRadius 12

Hide
Type "mkdir -p /tmp/quick-commitlint-demo-bin /tmp/quick-commitlint-demo"
Enter
Type "cp zig-out/bin/quick-commitlint /tmp/quick-commitlint-demo-bin/quick-commitlint"
Enter
Type `export PATH="/tmp/quick-commitlint-demo-bin:$PATH"`
Enter
Type "printf 'feat(parser): add fast validation\n' > /tmp/quick-commitlint-demo/COMMIT_EDITMSG"
Enter
Type "printf 'fix: Add parser.\n' > /tmp/quick-commitlint-demo/BAD_COMMIT_MSG"
Enter
Type "cd /tmp/quick-commitlint-demo"
Enter
Type "clear"
Enter
Show

Type "quick-commitlint --help"
Enter
Sleep 3s

Ctrl+L
Sleep 500ms

Type "cat COMMIT_EDITMSG"
Enter
Sleep 750ms
Type "quick-commitlint COMMIT_EDITMSG"
Enter
Sleep 3s

Ctrl+L
Sleep 500ms

Type "cat BAD_COMMIT_MSG"
Enter
Sleep 750ms
Type "quick-commitlint BAD_COMMIT_MSG"
Enter
Sleep 4s

Hide
Type "cd /vhs"
Enter
Type "rm -rf /tmp/quick-commitlint-demo /tmp/quick-commitlint-demo-bin"
Enter
