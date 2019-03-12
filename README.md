# cheerio-ptt-parser

## pre-install

```npm i```

## dependency

```
cheerio
axios
```

## how to use

```npm run crawl```

## Data-format

```
{
        "_id": "M.1552175552.A.65D",
        "postInfo": {
            "author": "Boss741108 (愛你一生一世)",
            "board": "Beauty",
            "title": "[正妹] 凶凶的  Somi 昭彌.gif",
            "time": 1552175550
        },
        "pushInfo": {
            "like": [
                {
                    "id": "kenness1019",
                    "comment": ": 2樓ㄏㄏ",
                    "ip": "",
                    "time": "03/10 18:24"
                },
                {
                    "id": "AmazingRustu",
                    "comment": ": 腿也很漂亮耶～",
                    "ip": "",
                    "time": "03/10 19:17"
                }
            ],
            "dislike": [],
            "arrow": [
                {
                    "id": "areett",
                    "comment": ": http://i.imgur.com/Nvj7PLc.jpg",
                    "ip": "",
                    "time": "03/10 11:57"
                },
                {
                    "id": "easy531",
                    "comment": ": 這身材...一定被淺規則淺慘了",
                    "ip": "",
                    "time": "03/10 18:22"
                }
            ]
        },
        "contentInfo": {
            "text": "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n--\n",
            "article_link": "https://www.ptt.cc/bbs/Beauty/M.1552175552.A.65D.html",
            "image": [
                "https://i.imgur.com/L3PyWsr.jpg",
                "https://i.imgur.com/rfWDEeP.jpg",
                "https://i.imgur.com/XtekJOK.jpg",
                "https://i.imgur.com/mLMFTnl.gif",
                "https://i.imgur.com/g5Sn4oZ.gif",
                "https://i.imgur.com/ANChc85.gif",
                "https://i.imgur.com/lyxsJpF.gif",
                "https://i.imgur.com/JkngWcu.gif",
                "https://i.imgur.com/TObOHin.gif",
                "https://i.imgur.com/JnG0F8o.gif",
                "https://i.imgur.com/RIiECP9.gif",
                "https://i.imgur.com/cVLfbl1.gif",
                "https://i.imgur.com/7iTIAaO.gif",
                "https://i.imgur.com/183k8pv.gif",
                "https://i.imgur.com/I56gCAg.gif",
                "https://i.imgur.com/j4sSovF.gif",
                "https://i.imgur.com/UmlkFLV.gif",
                "https://i.imgur.com/bGr4Hsr.gif",
                "https://i.imgur.com/MctbUHF.gif",
                "https://i.imgur.com/wUrwiWu.gif",
                "https://i.imgur.com/p2w8gyb.gif",
                "https://i.imgur.com/3hSATRG.gif"
            ],
            "link": [
                "https://i.imgur.com/L3PyWsr.jpg",
                "https://i.imgur.com/rfWDEeP.jpg",
                "https://i.imgur.com/XtekJOK.jpg",
                "https://i.imgur.com/mLMFTnl.gif",
                "https://i.imgur.com/g5Sn4oZ.gif",
                "https://i.imgur.com/ANChc85.gif",
                "https://i.imgur.com/lyxsJpF.gif",
                "https://i.imgur.com/JkngWcu.gif",
                "https://i.imgur.com/TObOHin.gif",
                "https://i.imgur.com/JnG0F8o.gif",
                "https://i.imgur.com/RIiECP9.gif",
                "https://i.imgur.com/cVLfbl1.gif",
                "https://i.imgur.com/7iTIAaO.gif",
                "https://i.imgur.com/183k8pv.gif",
                "https://i.imgur.com/I56gCAg.gif",
                "https://i.imgur.com/j4sSovF.gif",
                "https://i.imgur.com/UmlkFLV.gif",
                "https://i.imgur.com/bGr4Hsr.gif",
                "https://i.imgur.com/MctbUHF.gif",
                "https://i.imgur.com/wUrwiWu.gif",
                "https://i.imgur.com/p2w8gyb.gif",
                "https://i.imgur.com/3hSATRG.gif"
            ]
        },
        "boardName": "Beauty",
        "isVisible": true
    }
```

## DB-Schema

```
## DB-Schema

    CollectionName: pttArticle
    
    {
        boardName: { type: String },
        postInfo: {
            author: String,
            board: String,
            title: String,
            time: Date
        },
        pushInfo: {
            like: [
              {
                  id: String,
                  comment: String,
                  ip?: String,
                  time?: Date
              }
            ],
            dislike: [
              {
                  id: String,
                  comment: String,
                  ip?: String,
                  time?: Date
              }
            ],
            arrow: [
              {
                  id: String,
                  comment: String,
                  ip?: String,
                  time?: Date
              }
            ]
        },
        contentInfo: {
            text: String,
            article_link: String,
            image: [String],
            link: [String]
        }
        isVisible: Boolean
    }
```
[DB-Schema](https://hackmd.io/s/S12pu4l84)