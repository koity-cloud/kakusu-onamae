// Base fortune scores
const FORTUNE_SCORES = {
    '大大吉': 4,
    '大吉': 3,
    '吉': 2,
    '凶': -1,
    '大凶': -2,
    '-': 0
};

// Importance Weights
const METRIC_WEIGHTS = {
    tenkaku: 0,    // Not included
    jinkaku: 2,    // Important
    chikaku: 0,    // Displayed but not included in score (User Request)
    gaikaku: 2,    // Important
    soukaku: 4,    // Most Important
    shigotoun: 1,  // Low
    kateiun: 1     // Low
};

// Elements
const surnameInput = document.getElementById('surname-input');
const analyzeBtn = document.getElementById('analyze-btn');
const manualAdjustment = document.getElementById('manual-adjustment');
const strokeInputsDiv = document.getElementById('stroke-inputs');
const recalcBtn = document.getElementById('recalc-btn');
const resultsSection = document.getElementById('results-section');
const resultsList = document.getElementById('results-list');
const loading = document.getElementById('loading');
const kanjiModal = document.getElementById('kanji-modal');
const modalContent = document.getElementById('modal-content');
const closeModal = document.querySelector('.close-modal');
const nameListModal = document.getElementById('name-list-modal');
const nameListContainer = document.getElementById('name-list-container');
const nameListDesc = document.getElementById('name-list-description');

// State
let currentSurnameStrokes = [];
// Hardcoded Kanji Data (Common Joyo Kanji with readings) to ensure availability
const KANJI_DATA = {
    1: [
        { k: '一', r: 'イチ', n: 'かず・はじめ', m: 'ひとつ。はじめ。' },
        { k: '乙', r: 'オツ', n: 'おと・きのト', m: 'きのと。二番目。' }
    ],
    2: [
        { k: '乃', r: 'ナイ', n: 'の', m: 'すなわち。なんじ。' },
        { k: '力', r: 'リョク', n: 'ちから・つとむ', m: 'ちから。働き。' },
        { k: '七', r: 'シチ', n: 'なな・かず', m: 'ななつ。' },
        { k: '九', r: 'キュウ', n: 'ひさ・かず', m: 'ここのつ。' },
        { k: '十', r: 'ジュウ', n: 'とお・かず・しげる', m: 'とお。完全。' },
        { k: '人', r: 'ジン', n: 'ひと・と', m: 'ひと。人間。' },
        { k: '二', r: 'ニ', n: 'ふた・つぐ', m: 'ふたつ。' }
    ],
    3: [
        { k: '三', r: 'サン', n: 'み・みつ・かず', m: 'みっつ。' },
        { k: '千', r: 'セン', n: 'ち・かず・ゆき', m: '数が多い。' },
        { k: '大', r: 'ダイ', n: 'ひろ・まさ・もと', m: 'おおきい。' },
        { k: '子', r: 'シ', n: 'こ・ね', m: 'こども。' },
        { k: '小', r: 'ショウ', n: 'お・さ', m: 'ちいさい。' },
        { k: '山', r: 'サン', n: 'やま・たか', m: 'やま。' },
        { k: '川', r: 'セン', n: 'かわ', m: 'かわ。' },
        { k: '万', r: 'マン', n: 'かず・ま・よろず', m: 'よろず。数が多い。' },
        { k: '丈', r: 'ジョウ', n: 'たけ・とも・ひろ', m: 'たけ。長さ。' },
        { k: '久', r: 'キュウ', n: 'ひさ・ひさし', m: 'ひさしい。時間が長い。' }
    ],
    4: [
        { k: '允', r: 'イン', n: 'まこと・みつ・よし', m: 'まこと。ゆるす。' },
        { k: '元', r: 'ゲン', n: 'はじめ・もと・ちか', m: 'はじめ。もと。' },
        { k: '公', r: 'コウ', n: 'きみ・あきら・まさ', m: 'おおやけ。きみ。' },
        { k: '六', r: 'ロク', n: 'む・むつ', m: 'むっつ。' },
        { k: '円', r: 'エン', n: 'まる・まどか・つぶら', m: 'まるい。' },
        { k: '友', r: 'ユウ', n: 'とも・すけ', m: 'ともだち。' },
        { k: '天', r: 'テン', n: 'あま・たか', m: 'そら。' },
        { k: '太', r: 'タイ', n: 'ふと・た・ひろ', m: 'ふとい。おおきい。' },
        { k: '文', r: 'ブン', n: 'ふみ・あや', m: 'ふみ。もよう。' },
        { k: '日', r: 'ニチ', n: 'ひ・あき・はる', m: 'ひ。太陽。' },
        { k: '月', r: 'ゲツ', n: 'つき', m: 'つき。' },
        { k: '木', r: 'モク', n: 'き', m: 'き。' },
        { k: '水', r: 'スイ', n: 'みず', m: 'みず。' },
        { k: '火', r: 'カ', n: 'ひ', m: 'ひ。' },
        { k: '仁', r: 'ジン', n: 'ひと・ひとし・めぐみ', m: 'いつくしみ。思いやり。' },
        { k: '介', r: 'カイ', n: 'すけ・ゆき', m: '助ける。仲立ち。' }
    ],
    5: [
        { k: '央', r: 'オウ', n: 'なか・ひさ・あきら', m: '真ん中。' },
        { k: '平', r: 'ヘイ', n: 'たいら・ひら・まさ', m: 'たいらか。おだやか。' },
        { k: '弘', r: 'コウ', n: 'ひろし・ひろ', m: 'ひろい。ひろめる。' },
        { k: '本', r: 'ホン', n: 'もと', m: 'もと。ねっこ。' },
        { k: '正', r: 'セイ', n: 'ただし・まさ', m: 'ただしい。' },
        { k: '由', r: 'ユ', n: 'よし・ゆき', m: 'いわれ。よりどころ。' },
        { k: '礼', r: 'レイ', n: 'あや・ひろ・のり', m: 'おじぎ。のり。' },
        { k: '立', r: 'リツ', n: 'たつ・た・はる', m: 'たつ。' },
        { k: '世', r: 'セイ', n: 'よ・つぐ', m: 'よ。一生。' },
        { k: '代', r: 'ダイ', n: 'よ・しろ', m: 'かわる。よ。' },
        { k: '叶', r: 'キョウ', n: 'かな・やす', m: 'かなう。' },
        { k: '司', r: 'シ', n: 'つかさ・マモル', m: 'つかさどる。役人。' },
        { k: '史', r: 'シ', n: 'ふみ・ちか', m: '歴史。ふみ。' },
        { k: '加', r: 'カ', n: 'くわ・ます', m: 'くわえる。' },
        { k: '未', r: 'ミ', n: 'み', m: 'まだ...ない。羊。' }
    ],
    6: [
        { k: '光', r: 'コウ', n: 'ひかり・みつ・てる', m: 'ひかり。かがやく。' },
        { k: '吉', r: 'キチ', n: 'よし', m: 'よい。めでたい。' },
        { k: '圭', r: 'ケイ', n: 'よし・かど・たま', m: 'たま。角張った宝石。' },
        { k: '多', r: 'タ', n: 'おお・かず・まさ', m: 'おおい。' },
        { k: '好', r: 'コウ', n: 'よし・この・すき', m: 'よい。このむ。' },
        { k: '安', r: 'アン', n: 'やす・さだ', m: 'やすい。おだやか。' },
        { k: '早', r: 'ソウ', n: 'はや・さ', m: 'はやい。' },
        { k: '有', r: 'ユウ', n: 'あり・とも・なお', m: 'ある。もっている。' },
        { k: '朱', r: 'シュ', n: 'あけ・あか', m: 'あか。' },
        { k: '百', r: 'ヒャク', n: 'もも・かず', m: 'もも。数が多い。' },
        { k: '衣', r: 'イ', n: 'きぬ・ころも', m: 'きぬ。ころも。' },
        { k: '羽', r: 'ウ', n: 'はね・は・つばさ', m: 'はね。' },
        { k: '成', r: 'セイ', n: 'なり・なる・しげ', m: 'なる。成就する。' },
        { k: '旭', r: 'キョク', n: 'あさひ・あきら', m: 'あさひ。' },
        { k: '匡', r: 'キョウ', n: 'まさ・ただ', m: 'ただす。すくう。' },
        { k: '帆', r: 'ハン', n: 'ほ', m: 'ふねのほ。' }
    ],
    7: [
        { k: '杏', r: 'アン', n: 'あん・きょう', m: 'あんず。' },
        { k: '快', r: 'カイ', n: 'よし・はや', m: 'こころよい。' },
        { k: '李', r: 'リ', n: 'すもも', m: 'すもも。' },
        { k: '良', r: 'リョウ', n: 'よし・なが・まこと', m: 'よい。' },
        { k: '希', r: 'キ', n: 'のぞみ・まれ', m: 'のぞむ。まれ。' },
        { k: '佑', r: 'ユウ', n: 'たすく・すけ', m: 'たすける。' },
        { k: '作', r: 'サク', n: 'さく・とも', m: 'つくる。' },
        { k: '利', r: 'リ', n: 'とし・かず・み', m: 'するどい。役立つ。' },
        { k: '寿', r: 'ジュ', n: 'ことぶき・とし・ひさ', m: 'ことぶき。ながいき。' },
        { k: '孝', r: 'コウ', n: 'たか・あつ', m: '親孝行。' },
        { k: '克', r: 'コク', n: 'かつ・よし', m: 'かつ。耐える。' },
        { k: '冴', r: 'コ', n: 'さえ', m: 'さえる。こおる。' },
        { k: '吾', r: 'ゴ', n: 'われ・あ・ご', m: 'われ。自分。' },
        { k: '志', r: 'シ', n: 'こころざし・ゆき', m: 'こころざし。' },
        { k: '村', r: 'ソン', n: 'むら', m: 'むら。' },
        { k: '沙', r: 'サ', n: 'さ・すな', m: 'すな。' },
        { k: '男', r: 'ダン', n: 'おとこ', m: 'おとこ。' },
        { k: '秀', r: 'シュウ', n: 'ひで・ほ', m: 'ひいでる。優れる。' },
        { k: '花', r: 'カ', n: 'はな', m: 'はな。' },
        { k: '芳', r: 'ホウ', n: 'か・よし・ふさ', m: 'かんばしい。' },
        { k: '里', r: 'リ', n: 'さと', m: 'さと。' }
    ],
    8: [
        { k: '依', r: 'イ', n: 'より・よ', m: 'よる。たよる。' },
        { k: '佳', r: 'カ', n: 'か・よし', m: 'よい。美しい。' },
        { k: '奈', r: 'ナ', n: 'な', m: 'からなし。いかん。' },
        { k: '宗', r: 'シュウ', n: 'むね・かず', m: 'みたまや。中心。' },
        { k: '実', r: 'ジツ', n: 'み・みのる・まこと', m: 'み。内容。' },
        { k: '幸', r: 'コウ', n: 'さち・ゆき・よし', m: 'しあわせ。' },
        { k: '弦', r: 'ゲン', n: 'つる', m: '弓のつる。' },
        { k: '朋', r: 'ホウ', n: 'とも', m: 'ともだち。' },
        { k: '枝', r: 'シ', n: 'えだ', m: 'えだ。' },
        { k: '明', r: 'メイ', n: 'あかり・あきら・あけ', m: 'あかるい。' },
        { k: '享', r: 'キョウ', n: 'すすむ・たか・あきら', m: 'うける。もてなす。' },
        { k: '京', r: 'キョウ', n: 'きょう・みやこ', m: 'みやこ。' },
        { k: '林', r: 'リン', n: 'はやし・しげ', m: 'はやし。' },
        { k: '知', r: 'チ', n: 'とも・さと', m: 'しる。ち恵。' },
        { k: '和', r: 'ワ', n: 'かず・なごみ・やわ', m: 'やわらぐ。あえる。' },
        { k: '英', r: 'エイ', n: 'ひで・はな', m: 'はなぶさ。すぐれる。' },
        { k: '虎', r: 'コ', n: 'とら・たけ', m: 'とら。' },
        { k: '武', r: 'ブ', n: 'たけ・たけし', m: 'つよい。勇ましい。' },
        { k: '昌', r: 'ショウ', n: 'まさ・あき', m: 'さかん。よい。' },
        { k: '昂', r: 'コウ', n: 'たか・あき', m: 'あがる。たかい。' },
        { k: '昊', r: 'コウ', n: 'そら', m: 'おおぞら。' }
    ],
    9: [
        { k: '亮', r: 'リョウ', n: 'あき・あきら・たすく', m: 'あきらか。明るい。' },
        { k: '南', r: 'ナン', n: 'みなみ', m: 'みなみ。' },
        { k: '奏', r: 'ソウ', n: 'かなで・すすむ', m: 'かなでる。' },
        { k: '春', r: 'シュン', n: 'はる・かす', m: 'はる。' },
        { k: '星', r: 'セイ', n: 'ほし', m: 'ほし。' },
        { k: '美', r: 'ビ', n: 'み・よし・はる', m: 'うつくしい。' },
        { k: '香', r: 'コウ', n: 'か・かおり', m: 'かおり。' },
        { k: '風', r: 'フウ', n: 'かぜ', m: 'かぜ。' },
        { k: '音', r: 'オン', n: 'おと・ね', m: 'おと。' },
        { k: '紀', r: 'キ', n: 'のり・とし', m: 'のり。しるす。' },
        { k: '咲', r: 'ショウ', n: 'さき・さく', m: 'さく。わらう。' },
        { k: '信', r: 'シン', n: 'のぶ・まこと', m: 'まこと。信じる。' },
        { k: '保', r: 'ホ', n: 'たもつ・やす', m: 'たもつ。' },
        { k: '俊', r: 'シュン', n: 'とし・すぐる', m: 'すぐれる。' },
        { k: '勇', r: 'ユウ', n: 'いさむ・たけ', m: 'いさましい。' },
        { k: '玲', r: 'レイ', n: 'れい・たま', m: '玉の鳴る音。' },
        { k: '柚', r: 'ユ', n: 'ゆず', m: 'ゆず。' },
        { k: '律', r: 'リツ', n: 'りつ・のり', m: 'おきて。のり。' },
        { k: '柊', r: 'シュウ', n: 'ひいらぎ', m: 'ひいらぎ。' },
        { k: '秋', r: 'シュウ', n: 'あき', m: 'あき。' }
    ],
    10: [
        { k: '倫', r: 'リン', n: 'とも・のり・みち', m: 'ひとや。みち。' },
        { k: '修', r: 'シュウ', n: 'おさむ・のぶ', m: 'おさめる。' },
        { k: '健', r: 'ケン', n: 'たけ・たけし', m: 'すこやか。' },
        { k: '剛', r: 'ゴウ', n: 'つよし・たけ', m: 'つよい。かたい。' },
        { k: '夏', r: 'カ', n: 'なつ', m: 'なつ。' },
        { k: '宮', r: 'キュウ', n: 'みや', m: 'みや。御殿。' },
        { k: '将', r: 'ショウ', n: 'まさ・のぶ', m: 'ひきいる。大将。' },
        { k: '峻', r: 'シュン', n: 'たか・たかし', m: 'けわしい。たかい。' },
        { k: '桃', r: 'トウ', n: 'もも', m: 'もも。' },
        { k: '桜', r: 'オウ', n: 'さくら', m: 'さくら。' },
        { k: '泰', r: 'タイ', n: 'やす・ひろ', m: 'やすい。おちつき。' },
        { k: '涼', r: 'リョウ', n: 'すず・すずし', m: 'すずしい。' },
        { k: '純', r: 'ジュン', n: 'あつ・すみ', m: 'きいと。まじりけがない。' },
        { k: '紗', r: 'サ', n: 'さ・すず', m: 'うすぎぬ。' },
        { k: '莉', r: 'リ', n: 'り', m: 'ジャスミンの一種。' },
        { k: '華', r: 'カ', n: 'はな・はる', m: 'はな。さかえる。' },
        { k: '真', r: 'シン', n: 'ま・まこと', m: 'まこと。本当。' },
        { k: '凌', r: 'リョウ', n: 'しのぐ', m: 'しのぐ。こえる。' },
        { k: '隼', r: 'シュン', n: 'はやぶさ', m: 'はやぶさ。' },
        { k: '高', r: 'コウ', n: 'たか・たかし', m: 'たかい。' }
    ],
    11: [
        { k: '唯', r: 'ユイ', n: 'ゆい・ただ', m: 'ただ。' },
        { k: '彩', r: 'サイ', n: 'あや・いろ・さ', m: 'いろどる。' },
        { k: '悠', r: 'ユウ', n: 'ゆう・はるか・ひさ', m: 'とおい。ゆったり。' },
        { k: '啓', r: 'ケイ', n: 'ひろ・あきら', m: 'ひらく。教え導く。' },
        { k: '健', r: 'ケン', n: 'けん・たけし', m: 'すこやか。' },
        { k: '康', r: 'コウ', n: 'やす・しず', m: 'やすい。安らか。' },
        { k: '基', r: 'キ', n: 'もと', m: 'もとい。土台。' },
        { k: '麻', r: 'マ', n: 'あさ', m: 'あさ。' },
        { k: '理', r: 'リ', n: 'おさむ・こと・まさ', m: 'おさめる。ことわり。' },
        { k: '菜', r: 'サイ', n: 'な', m: 'な。野菜。' },
        { k: '萌', r: 'ホウ', n: 'もえ', m: 'めばえ。もえる。' },
        { k: '淳', r: 'ジュン', n: 'あつ・すなお', m: 'あつい。情が深い。' },
        { k: '望', r: 'ボウ', n: 'のぞみ・もち', m: 'のぞむ。満月。' },
        { k: '清', r: 'セイ', n: 'きよ・きよし', m: 'きよい。' },
        { k: '涼', r: 'リョウ', n: 'りょう・すず', m: 'すずしい。' },
        { k: '琉', r: 'リュウ', n: 'りゅう', m: '宝石の一種（瑠璃）。' },
        { k: '章', r: 'ショウ', n: 'あき・あきら', m: 'あきらか。文章。' }
    ],
    12: [
        { k: '偉', r: 'イ', n: 'ひで・えら', m: 'えらい。すぐれる。' },
        { k: '喜', r: 'キ', n: 'よし・はる', m: 'よろこぶ。' },
        { k: '智', r: 'チ', n: 'とも・さとし', m: 'ち恵。さとい。' },
        { k: '翔', r: 'ショウ', n: 'かける・と', m: 'かける。とぶ。' },
        { k: '結', r: 'ケツ', n: 'ゆい・むすぶ', m: 'むすぶ。' },
        { k: '陽', r: 'ヨウ', n: 'はる・ひ', m: 'ひ。太陽。' },
        { k: '葵', r: 'キ', n: 'あおい', m: 'あおい。向日葵。' },
        { k: '遥', r: 'ヨウ', n: 'はるか', m: 'はるか。とおい。' },
        { k: '雄', r: 'ユウ', n: 'お・かつ・たけ', m: 'おす。勇ましい。' },
        { k: '尊', r: 'ソン', n: 'たける・たか', m: 'とうとい。' },
        { k: '貴', r: 'キ', n: 'たか・たかし', m: 'たっとい。' },
        { k: '朝', r: 'チョウ', n: 'あさ・とも', m: 'あさ。' },
        { k: '葉', r: 'ヨウ', n: 'は', m: 'は。' },
        { k: '瑛', r: 'エイ', n: 'あきら', m: '水晶の光。' },
        { k: '凱', r: 'ガイ', n: 'よし・とき', m: 'かちどき。' }
    ],
    13: [
        { k: '園', r: 'エン', n: 'その', m: 'その。にわ。' },
        { k: '愛', r: 'アイ', n: 'あい・めぐ・まな', m: 'いとしむ。いつくしむ。' },
        { k: '想', r: 'ソウ', n: 'おも', m: 'おもう。' },
        { k: '蓮', r: 'レン', n: 'はす', m: 'はす。' },
        { k: '新', r: 'シン', n: 'あらた・あら・しん', m: 'あたらしい。' },
        { k: '楓', r: 'フウ', n: 'かえで', m: 'かえで。' },
        { k: '誠', r: 'セイ', n: 'まこと', m: 'まこと。' },
        { k: '詩', r: 'シ', n: 'うた', m: 'うた。' },
        { k: '聖', r: 'セイ', n: 'ひじり・きよ', m: 'ひじり。清らか。' },
        { k: '寛', r: 'カン', n: 'ひろし', m: 'くつろぐ。ひろい。' },
        { k: '暖', r: 'ダン', n: 'はる・のん', m: 'あたたかい。' },
        { k: '嵩', r: 'スウ', n: 'たか', m: 'かさ。高い。' }
    ],
    14: [
        { k: '碧', r: 'ヘキ', n: 'あお・みどり', m: 'あおい。深く青い石。' },
        { k: '綾', r: 'リョウ', n: 'あや', m: 'あや。模様のある絹。' },
        { k: '颯', r: 'サツ', n: 'はやて・そう', m: '風の吹くさま。' },
        { k: '瑠', r: 'ル', n: 'る', m: '宝石（瑠璃）。' },
        { k: '寧', r: 'ネイ', n: 'ねい・しず', m: 'ねんごろ。安らか。' },
        { k: '聡', r: 'ソウ', n: 'さとし', m: 'さとい。賢い。' },
        { k: '歌', r: 'カ', n: 'うた', m: 'うた。' },
        { k: '輔', r: 'ホ', n: 'たすく・すけ', m: 'たすける。' },
        { k: '緑', r: 'リョク', n: 'みどり', m: 'みどり。' }
    ],
    15: [
        { k: '輝', r: 'キ', n: 'かがや・てる', m: 'かがやく。' },
        { k: '穂', r: 'スイ', n: 'ほ', m: 'いなほ。' },
        { k: '慶', r: 'ケイ', n: 'よし・のり', m: 'よろこぶ。めでたい。' },
        { k: '潤', r: 'ジュン', n: 'うる・ひろ・ます', m: 'うるおう。' },
        { k: '諒', r: 'リョウ', n: 'りょう・まこと', m: 'あきらか。まこと。' },
        { k: '凜', r: 'リン', n: 'りん', m: '寒さがきびしい。凛々しい。' },
        { k: '舞', r: 'ブ', n: 'まい', m: 'まう。' },
        { k: '縁', r: 'エン', n: 'ゆかり・より', m: 'ふち。ゆかり。' }
    ],
    16: [
        { k: '樹', r: 'ジュ', n: 'いつき・たつのき', m: 'き。立ち木。' },
        { k: '澪', r: 'レイ', n: 'みお', m: 'みお。船の通り道。' },
        { k: '龍', r: 'リュウ', n: 'りゅう・たつ', m: 'りゅう。' },
        { k: '優', r: 'ユウ', n: 'すぐる・まさる・ゆう', m: 'やさしい。すぐれる。' },
        { k: '賢', r: 'ケン', n: 'かしこ・まさ', m: 'かしこい。' },
        { k: '篤', r: 'トク', n: 'あつ・あつし', m: 'あつい。情が深い。' },
        { k: '錦', r: 'キン', n: 'にしき', m: 'にしき。' }
    ],
    17: [
        { k: '優', r: 'ユウ', n: 'ゆう・やさ', m: 'やさしい。' },
        { k: '瞳', r: 'ドウ', n: 'ひとみ', m: 'ひとみ。' },
        { k: '翼', r: 'ヨク', n: 'つばさ', m: 'つばさ。たすける。' },
        { k: '陽', r: 'ヨウ', n: 'はる・ひ', m: 'ひ。みなみ。' },
        { k: '駿', r: 'シュン', n: 'はや・とし', m: 'すぐれる。俊馬。' },
        { k: '燦', r: 'サン', n: 'さん', m: 'きらめく。あざやか。' },
        { k: '謙', r: 'ケン', n: 'ゆずる・かね', m: 'へりくだる。' }
    ],
    18: [
        { k: '織', r: 'シキ', n: 'おり', m: 'おる。織物。' },
        { k: '藤', r: 'トウ', n: 'ふじ', m: 'ふじ。' },
        { k: '癒', r: 'ユ', n: 'いや', m: 'いやす。' },
        { k: '臨', r: 'リン', n: 'のぞむ', m: 'のぞむ。' },
        { k: '雛', r: 'スウ', n: 'ひな', m: 'ひな。ひよこ。' },
        { k: '瞬', r: 'シュン', n: 'またたき', m: 'またたく。' }
    ],
    19: [
        { k: '麗', r: 'レイ', n: 'うるわ', m: 'うるわしい。' },
        { k: '識', r: 'シキ', n: 'さと', m: 'しる。見識。' },
        { k: '響', r: 'キョウ', n: 'ひびき', m: 'ひびく。' },
        { k: '願', r: 'ガン', n: 'ねがい', m: 'ねがう。' },
        { k: '羅', r: 'ラ', n: 'ら', m: 'あみ。つらなる。' }
    ],
    20: [
        { k: '蘭', r: 'ラン', n: 'らん', m: 'ふじばかま。らん。' },
        { k: '馨', r: 'ケイ', n: 'かおる', m: 'かんばしい。' },
        { k: '譲', r: 'ジョウ', n: 'ゆずる', m: 'ゆずる。' },
        { k: '耀', r: 'ヨウ', n: 'かがや', m: 'かがやく。' }
    ],
    21: [
        { k: '櫻', r: 'オウ', n: 'さくら', m: 'さくら（旧字体）。' },
        { k: '躍', r: 'ヤク', n: 'おど', m: 'おどる。' },
        { k: '誉', r: 'ヨ', n: 'ほまれ', m: 'ほまれ。' }
    ],
    23: [
        { k: '恋', r: 'レン', n: 'こい', m: 'こい。' },
        { k: '麟', r: 'リン', n: 'りん', m: '麒麟。' }
    ],
    24: [
        { k: '鷹', r: 'ヨウ', n: 'たか', m: 'たか。' },
        { k: '琴', r: 'キン', n: 'こと', m: 'こと。' }
    ]
};

// --- Client-Side Name Database Logic ---
const NAME_DB_URLS = {
    KANJI: 'https://raw.githubusercontent.com/davidluzgouveia/kanji-data/master/kanji.json',
    MN_OPT: 'https://raw.githubusercontent.com/shuheilocale/japanese-personal-name-dataset/main/japanese_personal_name_dataset/dataset/first_name_man_opti.csv',
    FN_OPT: 'https://raw.githubusercontent.com/shuheilocale/japanese-personal-name-dataset/main/japanese_personal_name_dataset/dataset/first_name_woman_opti.csv'
};

let globalNameDB = null;
let isFetchingDB = false;
let currentFilterContext = {
    totalStrokes: 0,
    targetStrokes: [],
    gender: 'all'
};

// Filter Event Listeners
document.querySelectorAll('input[name="gender-filter"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentFilterContext.gender = e.target.value;
        renderNameList();
    });
});

async function ensureNameDB() {
    if (globalNameDB) return true;
    if (isFetchingDB) return new Promise(resolve => {
        const check = setInterval(() => {
            if (globalNameDB) { clearInterval(check); resolve(true); }
        }, 100);
    });

    isFetchingDB = true;
    const loadingElem = document.getElementById('name-list-loading');
    if (loadingElem) loadingElem.classList.remove('hidden');

    try {
        const [kanjiRes, mnRes, fnRes] = await Promise.all([
            fetch(NAME_DB_URLS.KANJI).then(r => r.json()),
            fetch(NAME_DB_URLS.MN_OPT).then(r => r.text()),
            fetch(NAME_DB_URLS.FN_OPT).then(r => r.text())
        ]);

        const kanjiStrokes = {};
        Object.keys(kanjiRes).forEach(char => {
            if (kanjiRes[char].strokes) kanjiStrokes[char] = kanjiRes[char].strokes;
        });

        const db = {};

        const processCSV = (csv, gender) => {
            const lines = csv.split('\n');
            // Dataset format: reading,romaji,kanji1,kanji2...
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const parts = line.split(',');
                if (parts.length < 3) continue;

                const yomi = parts[0];
                // parts[1] is romaji
                const kanjiCandidates = parts.slice(2);

                kanjiCandidates.forEach(name => {
                    if (!name) return;

                    let total = 0;
                    let valid = true;
                    const strokes = [];

                    for (const char of name) {
                        if (kanjiStrokes[char]) {
                            total += kanjiStrokes[char];
                            strokes.push(kanjiStrokes[char]);
                        } else {
                            // Try to look up in local KANJI_DATA if external fails
                            let foundLocal = false;
                            for (const s in KANJI_DATA) {
                                if (KANJI_DATA[s].find(k => k.k === char)) {
                                    total += parseInt(s);
                                    strokes.push(parseInt(s));
                                    foundLocal = true;
                                    break;
                                }
                            }
                            if (!foundLocal) {
                                valid = false;
                                break;
                            }
                        }
                    }

                    if (valid) {
                        if (!db[total]) db[total] = [];
                        // Avoid duplicates
                        if (!db[total].find(n => n.n === name && n.r === yomi)) {
                            db[total].push({ n: name, r: yomi, g: gender, s: strokes });
                        }
                    }
                });
            }
        };

        processCSV(mnRes, 'm');
        processCSV(fnRes, 'f');

        globalNameDB = db;
        return true;
    } catch (e) {
        console.error("Failed to build name DB", e);
        alert('名前データの読み込みに失敗しました。');
        return false;
    } finally {
        isFetchingDB = false;
        if (loadingElem) loadingElem.classList.add('hidden');
    }
}

// Event Listeners
analyzeBtn.addEventListener('click', handleAnalyze);
recalcBtn.addEventListener('click', () => calculateAndDisplay(currentSurnameStrokes));
if (closeModal) closeModal.addEventListener('click', () => kanjiModal.classList.add('hidden'));
window.addEventListener('click', (e) => {
    if (e.target === kanjiModal) kanjiModal.classList.add('hidden');
    if (e.target === nameListModal) nameListModal.classList.add('hidden');
});

const closeNameListBtn = document.querySelector('.close-name-list');
if (closeNameListBtn) {
    closeNameListBtn.addEventListener('click', () => {
        nameListModal.classList.add('hidden');
    });
}

async function handleAnalyze() {
    const surname = surnameInput.value.trim();
    if (!surname) return alert('名前を入力してください');

    loading.classList.remove('hidden');
    resultsSection.classList.remove('hidden');
    resultsList.innerHTML = '';
    manualAdjustment.classList.add('hidden');

    try {
        const strokes = await fetchStrokes(surname);
        currentSurnameStrokes = strokes;
        renderStrokeInputs(surname, currentSurnameStrokes);
        manualAdjustment.classList.remove('hidden');
        calculateAndDisplay(currentSurnameStrokes);
    } catch (error) {
        console.error(error);
        alert('データ取得に失敗しました。');
        currentSurnameStrokes = new Array(surname.length).fill(0);
        renderStrokeInputs(surname, currentSurnameStrokes);
        manualAdjustment.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
    }
}

async function fetchStrokes(text) {
    const strokes = [];
    for (const char of text) {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 2000);

            const response = await fetch(`https://kanjiapi.dev/v1/kanji/${char}`, { signal: controller.signal });
            clearTimeout(id);

            if (!response.ok) throw new Error(`Kanji not found: ${char}`);
            const data = await response.json();
            strokes.push(data.stroke_count);
        } catch (e) {
            console.warn(`Failed to fetch strokes for ${char}, defaulting to 0`);
            strokes.push(0);
        }
    }
    return strokes;
}

function renderStrokeInputs(surname, strokes) {
    strokeInputsDiv.innerHTML = '';
    [...surname].forEach((char, index) => {
        const div = document.createElement('div');
        div.className = 'stroke-input-row';
        div.innerHTML = `
            <label>${char}:</label>
            <input type="number" value="${strokes[index]}" min="1" data-index="${index}" class="stroke-val">
            <span>画</span>
        `;
        strokeInputsDiv.appendChild(div);
    });

    // Add change listeners to update state
    document.querySelectorAll('.stroke-val').forEach(input => {
        input.addEventListener('change', (e) => {
            currentSurnameStrokes[e.target.dataset.index] = parseInt(e.target.value) || 0;
        });
    });
}

function calculateAndDisplay(surnameStrokes) {
    resultsList.innerHTML = '';

    // Create Header Row
    const header = document.createElement('div');
    header.className = 'result-row header-row';
    header.innerHTML = `
        <div class="col-name">名前画数</div>
        <div class="col-metric important">総格</div>
        <div class="col-metric">地格</div>
        <div class="col-metric">人格</div>
        <div class="col-metric">外格</div>
        <div class="col-metric optional">仕事</div>
        <div class="col-metric optional">家庭</div>
    `;
    resultsList.appendChild(header);

    const suggestions = generateSuggestions(surnameStrokes);

    // Sort logic updated
    suggestions.sort((a, b) => b.weightedScore - a.weightedScore);

    // Limit to top 50
    const displayList = suggestions.slice(0, 50);

    displayList.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'result-row fade-in-up clickable-row';
        row.style.animationDelay = `${Math.min(index * 0.02, 1)}s`;
        row.dataset.nameStrokes = JSON.stringify(item.nameStrokes);

        // Make the main row click open the Name List (New default behavior)
        const nameStrokes = item.nameStrokes;

        row.addEventListener('click', (e) => {
            openNameList(nameStrokes);
        });

        // Format name like "3+15"
        let patternText = item.nameStrokes.join('+') + '画';

        row.innerHTML = `
            <div class="col-name">
                <span class="name-pattern">${patternText}</span>
                <span class="score-pill" style="background:${getScoreColor(item.weightedScore)}">${item.weightedScore}pt</span>
                <span class="tap-hint">タップで名前実例</span>
            </div>
            ${renderCell(item.metrics.soukaku, true)}
            ${renderCell(item.metrics.chikaku)}
            ${renderCell(item.metrics.jinkaku)}
            ${renderCell(item.metrics.gaikaku)}
            ${renderCell(item.metrics.shigotoun, false, true)}
            ${renderCell(item.metrics.kateiun, false, true)}
        `;
        resultsList.appendChild(row);
    });

    if (displayList.length === 0) {
        resultsList.innerHTML = '<p style="text-align:center; padding: 20px;">条件に合う良い組み合わせが見つかりませんでした。</p>';
    }
}

async function openNameList(nameStrokes) {
    nameListModal.classList.remove('hidden');
    nameListContainer.innerHTML = '';

    // Calculate total for DB key lookup
    const total = nameStrokes.reduce((a, b) => a + b, 0);
    const patternStr = nameStrokes.join('+');

    nameListDesc.textContent = `画数構成「${patternStr}画」（地格${total}画）になる名前の候補`;

    currentFilterContext.totalStrokes = total;
    currentFilterContext.targetStrokes = nameStrokes;

    // Sync state with UI just in case
    const checked = document.querySelector('input[name="gender-filter"]:checked');
    if (checked) currentFilterContext.gender = checked.value;

    await ensureNameDB();

    renderNameList();
}

function renderNameList() {
    const { totalStrokes, targetStrokes, gender } = currentFilterContext;

    if (!globalNameDB || !globalNameDB[totalStrokes]) {
        nameListContainer.innerHTML = '<p style="text-align:center; padding:20px;">該当する名前候補が見つかりませんでした。</p>';
        return;
    }

    let names = globalNameDB[totalStrokes];

    // Filter by Gender
    if (gender !== 'all') {
        names = names.filter(n => n.g === gender);
    }

    // Filter by Exact Stroke Pattern
    // targetStrokes is e.g. [4, 8]
    if (targetStrokes && targetStrokes.length > 0) {
        names = names.filter(n => {
            if (n.s.length !== targetStrokes.length) return false;
            return n.s.every((val, i) => val === targetStrokes[i]);
        });
    }

    if (names.length === 0) {
        nameListContainer.innerHTML = '<p style="text-align:center; padding:20px;">この画数構成（' + targetStrokes.join('+') + '画）の登録データがありませんでした。<br>条件を変えてお試しください。</p>';
        return;
    }

    let html = '<div class="name-grid">';
    names.forEach(n => {
        // Calculate total kanji strokes for display (should match totalStrokes, but good to verify)
        // actually n.s is an array of strokes.
        const actualTotal = n.s.reduce((a, b) => a + b, 0);

        html += `
            <div class="name-card">
                <div class="nc-main">
                    <span class="nc-kanji">${n.n}</span>
                    <span class="nc-read">（${n.r}）</span>
                </div>
                <div class="nc-meta">
                    <span class="nc-strokes">${actualTotal}画</span>
                    <span class="nc-gender gender-${n.g}">${n.g === 'm' ? '男' : '女'}</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    nameListContainer.innerHTML = html;
}

function openKanjiModal(strokes, score) {
    kanjiModal.classList.remove('hidden');

    let html = `<h3>おすすめの漢字候補</h3>`;
    html += `<p class="modal-pattern">${strokes.join('画 + ')}画 = 総合スコア ${score}pt</p>`;

    strokes.forEach((s, i) => {
        const candidates = KANJI_DATA[s] || [];

        let kanjiTags = '';
        if (candidates.length > 0) {
            kanjiTags = candidates.map(c => `
                <div class="kanji-item">
                    <div class="k-char">${c.k}</div>
                    <div class="k-info">
                        <span class="k-read">読: ${c.r}</span>
                        ${c.n ? `<span class="k-nano">名: ${c.n}</span>` : ''}
                        ${c.m ? `<p class="k-mean">${c.m}</p>` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            kanjiTags = '<p>該当する主要な漢字が見つかりませんでした</p>';
        }

        html += `<div class="kanji-group">
            <h4>${i + 1}文字目 (${s}画)</h4>
            <div class="kanji-list-flex">
                ${kanjiTags}
            </div>
        </div>`;
    });

    modalContent.innerHTML = html;
}


function renderCell(data, isMain = false, isOptional = false) {
    let text = data.result;
    let cls = getClass(text);
    let optionalClass = isOptional ? 'optional' : '';
    let mainClass = isMain ? 'important' : '';

    return `<div class="col-metric ${mainClass} ${optionalClass} ${cls}">
        <span class="mark">${text}</span>
        <span class="val">${data.value}画</span>
    </div>`;
}

function getClass(result) {
    if (result.includes('大吉')) return 'cell-daikichi'; // Covers Daikichi & Dadaikichi
    if (result.includes('吉')) return 'cell-kichi';
    if (result.includes('凶')) return 'cell-kyo'; // Covers Kyo & Daikyo
    return 'cell-none';
}

function getScoreColor(score) {
    // Adjusted thresholds for weighted score
    // Max possible roughly: 4*4 + 2*3 + 2*3 + 2*3 + 1*3 + 1*3 = 16+6+6+6+3+3 = 40
    // Good score: > 30
    if (score >= 35) return '#d32f2f'; // Excellect
    if (score >= 25) return '#e64a19'; // Good
    if (score >= 10) return '#4b6cb7'; // Average
    return '#5d4037'; // Bad
}

function getFortune(score) {
    // Original FORTUNE_TABLE is used here
    const FORTUNE_TABLE = {
        2: '凶', 3: '大吉', 4: '大凶', 5: '大吉', 6: '大吉', 7: '吉', 8: '吉', 9: '大凶', 10: '大凶',
        11: '大吉', 12: '大凶', 13: '大吉', 14: '凶', 15: '大大吉', 16: '大吉', 17: '吉', 18: '吉',
        19: '大凶', 20: '大凶', 21: '大吉', 22: '凶', 23: '大吉', 24: '大大吉', 25: '吉', 26: '吉',
        27: '凶', 28: '凶', 29: '大吉', 30: '凶', 31: '大大吉', 32: '大吉', 33: '大吉', 34: '大凶',
        35: '大吉', 36: '大凶', 37: '大吉', 38: '吉', 39: '大吉', 40: '凶', 41: '大吉'
    };
    if (score > 41) return '-';
    return FORTUNE_TABLE[score] || '-';
}

function generateSuggestions(sStrokes) {
    const list = [];
    const maxStroke = 24; // Limit name char strokes to reasonable range (common kanji rarely >24)

    // Pattern 1: 1 char name
    for (let n1 = 1; n1 <= maxStroke; n1++) {
        const result = calculateMetrics(sStrokes, [n1]);
        list.push(result);
    }

    // Pattern 2: 2 char name
    for (let n1 = 1; n1 <= maxStroke; n1++) {
        for (let n2 = 1; n2 <= maxStroke; n2++) {
            const result = calculateMetrics(sStrokes, [n1, n2]);
            list.push(result);
        }
    }
    return list;
}

// Removed strict filter function 'isGoodResult' as we now sort by score


function calculateMetrics(sStrokes, nStrokes) {
    // Logic implementation based on user request
    /*
    名字 (S): S1, S2... (1文字の場合は S=[P(1), S1])
    名前 (N): N1, N2... (1文字の場合は N=[N1, P(1)])
    
    1文字の扱い:
    名字1文字: S=[1(仮), S1]。仮数は外格のみ使用(1)、他はS1のみ使用。
    名前1文字: N=[N1, 1(仮)]。仮数は外格のみ使用(1)、他はN1のみ使用。
    */

    let S_Real = [...sStrokes]; // Real strokes for calculation
    let N_Real = [...nStrokes];

    // Flags for 1-char handling
    const isS1 = S_Real.length === 1;
    const isN1 = N_Real.length === 1;

    // Helper to get value
    const sum = arr => arr.reduce((a, b) => a + b, 0);

    // 1. Tenkaku (S Total) - Only real, no pseudo
    const tenkakuVal = sum(S_Real);

    // 2. Jinkaku (S Last + N First)
    const sLast = S_Real[S_Real.length - 1];
    const nFirst = N_Real[0];
    const jinkakuVal = sLast + nFirst;

    // 3. Chikaku (N Total)
    // Rule: "地格＝名前１文字目＋名前２文字目合計"
    // Rule: "名前1文字...仮数は外格のみ...他はカウントしない(0)" -> So Chikaku = N1
    const chikakuVal = sum(N_Real);

    // 4. Gaikaku
    /*
    外格 = 名字1 + 名前2
    S1文字 -> S=[P(1), S1] -> 名字1はP(1) -> 1
    N1文字 -> N=[N1, P(1)] -> 名前2はP(1) -> 1
    S複数 -> 名字1はS_Real[0]
    N複数 -> 名前2はN_Real[1]
    */
    let gaikakuS = isS1 ? 1 : S_Real[0];
    let gaikakuN = isN1 ? 1 : N_Real[N_Real.length - 1]; // Use last if N>=2 (logic says N2, assuming max 2 char names logic holds or N_Last)
    // Detailed logic check: "外格＝名字１文字目＋名前２文字目". Assuming 2 char max for N based on generatingloop.
    if (N_Real.length > 1) gaikakuN = N_Real[N_Real.length - 1];
    const gaikakuVal = gaikakuS + gaikakuN;

    // 5. Shigotoun = S Total + N First
    // Rule: "名字1...仮数は...仕事運ではカウントしない" -> Use S_Real sum
    const shigotounVal = sum(S_Real) + N_Real[0];

    // 6. Kateiun = S Second + N Total
    // Rule: "名前1...仮数は...家庭運ではカウントしない" -> Use N_Real sum
    // S Second logic: "名字２文字目". If S is 1 char?
    // User Request: "名字1文字...名字1を仮数(1)...外格のみ...他は名字1の実画数"
    // WAIT. If S is 1 char, there is no "S Second".
    // Standard logic for 1-char surname in Kateiun usually uses the real char as part calculation?
    // User says: "名字：名字1を仮数として..." -> This usually means S structure is [Pseudo, Real].
    // But user says "外格のみ1画...他はカウントしない".
    // Let's re-read: "運勢判定...家庭運＝名字２文字目＋名前合計".
    // If S is 1 char, does it have a 'Second' char?
    // Standard Seimei Handan for 1 char surname (e.g. 牧 8):
    // Treats it as (仮1, 牧8).
    // Tenkaku: 1+8=9 (Usual) OR 8 (User says "天格=名字合計", "仮数は外格のみ...他はカウントしない" -> So Tenkaku is 8)
    // Kateiun (House): S2 + N_Total. Here S2 is '牧8'.
    // Let's assume for S=1char, "Second" implies the actual character (since it's pushed to 2nd distinct pos by pseudo).
    // So if S is 1 char, S_Second is S_Real[0].

    // If S has >1 chars, S_Second is S_Real[1].
    let sSecondForKatei = isS1 ? S_Real[0] : S_Real[1];
    const kateiunVal = sSecondForKatei + sum(N_Real);

    // 7. Soukaku = All Total
    const soukakuVal = sum(S_Real) + sum(N_Real);

    const metrics = {
        tenkaku: { value: tenkakuVal, result: getFortune(tenkakuVal) },
        jinkaku: { value: jinkakuVal, result: getFortune(jinkakuVal) },
        chikaku: { value: chikakuVal, result: getFortune(chikakuVal) },
        gaikaku: { value: gaikakuVal, result: getFortune(gaikakuVal) },
        shigotoun: { value: shigotounVal, result: getFortune(shigotounVal) },
        kateiun: { value: kateiunVal, result: getFortune(kateiunVal) },
        soukaku: { value: soukakuVal, result: getFortune(soukakuVal) }
    };

    // Calculate Weighted Score
    let weightedScore = 0;
    Object.keys(metrics).forEach(key => {
        const resultStr = metrics[key].result;
        const scoreBase = FORTUNE_SCORES[resultStr] || 0;
        const weight = METRIC_WEIGHTS[key] || 0;
        weightedScore += scoreBase * weight;
    });

    return { nameStrokes: nStrokes, metrics, weightedScore };
}
