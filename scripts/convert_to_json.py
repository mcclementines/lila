from PyDictionary import PyDictionary

dictionary = PyDictionary()

def tpos(t):
    if t == "Verb":
        return "v."
    elif t == "Noun":
        return "n."
    elif t == "Adjective":
        return "adj."
    elif t == "Adverb":
        return "adv."
    else:
        return ""

with open("gre_vocab_list.txt", "r") as l:
    nls = "["

    for line in l.readlines():
        line = line.strip()
        meanings = dictionary.meaning(line)

        if meanings is None:
            print("Error: %s" % line)
            continue

        pos, d = next(iter(meanings.items()))

        nls += "\n    {"
        nls += "\n        \"word\": \"%s\"," % line
        nls += "\n        \"type\": \"%s\"," % tpos(pos)
        nls += "\n        \"definition\": \"%s\"" % d[0] if len(d) > 0 else ""
        nls += "\n    },"

    nls += "\n]"

    with open("gre_vocab_list.json", "w") as nl:
        nl.write(nls)
