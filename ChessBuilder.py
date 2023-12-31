import urllib.request

url = "https://raw.githubusercontent.com/DarkSnakeGang/GoogleSnakePudding/chess/PuddingMod.js"  # Replace with the actual URL of the file you want to download
destination_file = "PuddingMod.js"  # Replace with the desired local file name

urllib.request.urlretrieve(url, destination_file)

chess_file = open("ChessMod.js", "w", encoding='utf-8')
chess_init = open("ChessInit.js", "r", encoding='utf-8')
pudding = open("PuddingMod.js", "r", encoding='utf-8')

chess_file.write(pudding.read())
chess_file.write(chess_init.read())
pudding.close()
chess_init.close()
chess_file.close()