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

// State
let currentSurnameStrokes = [];
// Hardcoded Kanji Data (Common Joyo Kanji with readings) to ensure availability
const KANJI_DATA = {
    1: [{ k: '一', r: 'イチ' }, { k: '乙', r: 'オツ' }],
    2: [{ k: '二', r: 'ニ' }, { k: '七', r: 'シチ' }, { k: '八', r: 'ハチ' }, { k: '九', r: 'キュウ' }, { k: '十', r: 'ジュウ' }, { k: '人', r: 'ジン' }, { k: '入', r: 'ニュウ' }, { k: '力', r: 'リョク' }],
    3: [{ k: '三', r: 'サン' }, { k: '川', r: 'セン' }, { k: '工', r: 'コウ' }, { k: '土', r: 'ド' }, { k: '大', r: 'ダイ' }, { k: '女', r: 'ジョ' }, { k: '山', r: 'サン' }, { k: '子', r: 'シ' }, { k: '小', r: 'ショウ' }, { k: '口', r: 'コウ' }],
    4: [{ k: '四', r: 'ヨン' }, { k: '五', r: 'ゴ' }, { k: '六', r: 'ロク' }, { k: '円', r: 'エン' }, { k: '天', r: 'テン' }, { k: '手', r: 'シュ' }, { k: '文', r: 'ブン' }, { k: '日', r: 'ニチ' }, { k: '月', r: 'ゲツ' }, { k: '木', r: 'モク' }, { k: '水', r: 'スイ' }, { k: '火', r: 'カ' }, { k: '犬', r: 'ケン' }, { k: '王', r: 'オウ' }, { k: '中', r: 'チュウ' }],
    5: [{ k: '正', r: 'セイ' }, { k: '生', r: 'セイ' }, { k: '田', r: 'デン' }, { k: '白', r: 'ハク' }, { k: '目', r: 'モク' }, { k: '石', r: 'セキ' }, { k: '立', r: 'リツ' }, { k: '本', r: 'ホン' }, { k: '台', r: 'ダイ' }, { k: '平', r: 'ヘイ' }, { k: '加', r: 'カ' }, { k: '兄', r: 'キョウ' }, { k: '史', r: 'シ' }, { k: '央', r: 'オウ' }, { k: '未', r: 'ミ' }, { k: '世', r: 'セイ' }, { k: '由', r: 'ユ' }],
    6: [{ k: '気', r: 'キ' }, { k: '休', r: 'キュウ' }, { k: '先', r: 'セン' }, { k: '早', r: 'ソウ' }, { k: '百', r: 'ヒャク' }, { k: '光', r: 'コウ' }, { k: '多', r: 'タ' }, { k: '羽', r: 'ウ' }, { k: '会', r: 'カイ' }, { k: '同', r: 'ドウ' }, { k: '回', r: 'カイ' }, { k: '次', r: 'ジ' }, { k: '吉', r: 'キチ' }, { k: '有', r: 'ユウ' }, { k: '好', r: 'コウ' }, { k: '安', r: 'アン' }, { k: '帆', r: 'ハン' }],
    7: [{ k: '花', r: 'カ' }, { k: '村', r: 'ソン' }, { k: '男', r: 'ダン' }, { k: '見', r: 'ケン' }, { k: '赤', r: 'セキ' }, { k: '足', r: 'ソク' }, { k: '車', r: 'シャ' }, { k: '社', r: 'シャ' }, { k: '町', r: 'チョウ' }, { k: '雨', r: 'ウ' }, { k: '学', r: 'ガク' }, { k: '希', r: 'キ' }, { k: '良', r: 'リョウ' }, { k: '李', r: 'リ' }, { k: '杏', r: 'アン' }, { k: '里', r: 'リ' }],
    8: [{ k: '金', r: 'キン' }, { k: '空', r: 'クウ' }, { k: '青', r: 'セイ' }, { k: '林', r: 'リン' }, { k: '明', r: 'メイ' }, { k: '京', r: 'キョウ' }, { k: '東', r: 'トウ' }, { k: '果', r: 'カ' }, { k: '奈', r: 'ナ' }, { k: '知', r: 'チ' }, { k: '武', r: 'ブ' }, { k: '虎', r: 'トラ' }, { k: '幸', r: 'コウ' }, { k: '和', r: 'ワ' }, { k: '季', r: 'キ' }, { k: '実', r: 'ジツ' }],
    9: [{ k: '音', r: 'オン' }, { k: '草', r: 'ソウ' }, { k: '茶', r: 'チャ' }, { k: '星', r: 'セイ' }, { k: '春', r: 'シュン' }, { k: '風', r: 'フウ' }, { k: '食', r: 'ショク' }, { k: '前', r: 'ゼン' }, { k: '美', r: 'ビ' }, { k: '香', r: 'コウ' }, { k: '南', r: 'ナン' }, { k: '海', r: 'カイ' }, { k: '洋', r: 'ヨウ' }, { k: '奏', r: 'ソウ' }, { k: '玲', r: 'レイ' }, { k: '紀', r: 'キ' }],
    10: [{ k: '夏', r: 'カ' }, { k: '家', r: 'カ' }, { k: '校', r: 'コウ' }, { k: '通', r: 'ツウ' }, { k: '高', r: 'コウ' }, { k: '真', r: 'シン' }, { k: '純', r: 'ジュン' }, { k: '桜', r: 'サクラ' }, { k: '紗', r: 'サ' }, { k: '莉', r: 'リ' }, { k: '修', r: 'シュウ' }, { k: '健', r: 'ケン' }, { k: '剛', r: 'ゴウ' }, { k: '書', r: 'ショ' }, { k: '馬', r: 'バ' }],
    11: [{ k: '雪', r: 'セツ' }, { k: '船', r: 'セン' }, { k: '魚', r: 'ギョ' }, { k: '鳥', r: 'チョウ' }, { k: '黄', r: 'コウ' }, { k: '黒', r: 'コク' }, { k: '彩', r: 'サイ' }, { k: '理', r: 'リ' }, { k: '菜', r: 'ナ' }, { k: '萌', r: 'モエ' }, { k: '唯', r: 'ユイ' }, { k: '麻', r: 'マ' }, { k: '淳', r: 'ジュン' }, { k: '悠', r: 'ユウ' }, { k: '健', r: 'ケン' }],
    12: [{ k: '晴', r: 'セイ' }, { k: '雲', r: 'ウン' }, { k: '絵', r: 'カイ' }, { k: '間', r: 'カン' }, { k: '場', r: 'ジョウ' }, { k: '朝', r: 'チョウ' }, { k: '結', r: 'ユイ' }, { k: '陽', r: 'ヨウ' }, { k: '葉', r: 'ヨウ' }, { k: '葵', r: 'アオイ' }, { k: '智', r: 'チ' }, { k: '達', r: 'タツ' }, { k: '翔', r: 'ショウ' }, { k: '遥', r: 'ハルカ' }, { k: '順', r: 'ジュン' }],
    13: [{ k: '園', r: 'エン' }, { k: '遠', r: 'エン' }, { k: '話', r: 'ワ' }, { k: '新', r: 'シン' }, { k: '数', r: 'スウ' }, { k: '電', r: 'デン' }, { k: '愛', r: 'アイ' }, { k: '蓮', r: 'レン' }, { k: '夢', r: 'ユメ' }, { k: '楓', r: 'カエデ' }, { k: '詩', r: 'シ' }, { k: '想', r: 'ソウ' }, { k: '聖', r: 'セイ' }, { k: '寛', r: 'カン' }, { k: '誠', r: 'セイ' }],
    14: [{ k: '聞', r: 'ブン' }, { k: '語', r: 'ゴ' }, { k: '読', r: 'ドク' }, { k: '様', r: 'ヨウ' }, { k: '緑', r: 'リョク' }, { k: '歌', r: 'カ' }, { k: '碧', r: 'アオ' }, { k: '綾', r: 'アヤ' }, { k: '輔', r: 'スケ' }, { k: '颯', r: 'ハヤテ' }, { k: '瑠', r: 'ル' }, { k: '寧', r: 'ネイ' }, { k: '鳳', r: 'ホウ' }, { k: '熊', r: 'クマ' }, { k: '聡', r: 'ソウ' }],
    15: [{ k: '線', r: 'セン' }, { k: '横', r: 'オウ' }, { k: '熱', r: 'ネツ' }, { k: '調', r: 'チョウ' }, { k: '輝', r: 'キ' }, { k: '舞', r: 'マイ' }, { k: '凜', r: 'リン' }, { k: '潤', r: 'ジュン' }, { k: '慶', r: 'ケイ' }, { k: '穂', r: 'ホ' }, { k: '諒', r: 'リョウ' }, { k: '論', r: 'ロン' }, { k: '賞', r: 'ショウ' }, { k: '輪', r: 'リン' }, { k: '徹', r: 'テツ' }],
    16: [{ k: '親', r: 'シン' }, { k: '頭', r: 'トウ' }, { k: '薬', r: 'ヤク' }, { k: '館', r: 'カン' }, { k: '樹', r: 'ジュ' }, { k: '澪', r: 'ミオ' }, { k: '龍', r: 'リュウ' }, { k: '興', r: 'コウ' }, { k: '優', r: 'ユウ' }, { k: '橘', r: 'タチバナ' }, { k: '頼', r: 'ライ' }, { k: '賢', r: 'ケン' }, { k: '錦', r: 'ニシキ' }, { k: '篤', r: 'トク' }, { k: '憲', r: 'ケン' }],
    17: [{ k: '曜', r: 'ヨウ' }, { k: '顔', r: 'ガン' }, { k: '点', r: 'テン' }, { k: '優', r: 'ユウ' }, { k: '駿', r: 'シュン' }, { k: '瞳', r: 'ヒトミ' }, { k: '翼', r: 'ツバサ' }, { k: '遥', r: 'ハルカ' }, { k: '陽', r: 'ヨウ' }, { k: '燦', r: 'サン' }, { k: '嶺', r: 'レイ' }, { k: '謙', r: 'ケン' }, { k: '鞠', r: 'マリ' }, { k: '環', r: 'カン' }],
    18: [{ k: '観', r: 'カン' }, { k: '題', r: 'ダイ' }, { k: '類', r: 'ルイ' }, { k: '験', r: 'ケン' }, { k: '織', r: 'シキ' }, { k: '藤', r: 'トウ' }, { k: '癒', r: 'ユ' }, { k: '臨', r: 'リン' }, { k: '藍', r: 'ラン' }, { k: '瞬', r: 'シュン' }, { k: '顕', r: 'ケン' }, { k: '鎮', r: 'チン' }, { k: '鎌', r: 'カマ' }, { k: '鯉', r: 'コイ' }, { k: '雛', r: 'ヒナ' }],
    19: [{ k: '警', r: 'ケイ' }, { k: '識', r: 'シキ' }, { k: '響', r: 'キョウ' }, { k: '麗', r: 'レイ' }, { k: '羅', r: 'ラ' }, { k: '瀬', r: 'セ' }, { k: '願', r: 'ガン' }, { k: '鏡', r: 'キョウ' }, { k: '韻', r: 'イン' }, { k: '霧', r: 'キリ' }, { k: '鵬', r: 'ホウ' }, { k: '鯨', r: 'クジラ' }, { k: '譜', r: 'フ' }, { k: '藻', r: 'ソウ' }],
    20: [{ k: '議', r: 'ギ' }, { k: '競', r: 'キョウ' }, { k: '護', r: 'ゴ' }, { k: '譲', r: 'ジョウ' }, { k: '馨', r: 'ケイ' }, { k: '耀', r: 'ヨウ' }, { k: '蘭', r: 'ラン' }, { k: '響', r: 'キョウ' }, { k: '鐘', r: 'カネ' }, { k: '懸', r: 'ケン' }, { k: '騰', r: 'トウ' }, { k: '籍', r: 'セキ' }, { k: '醸', r: 'ジョウ' }, { k: '露', r: 'ロ' }, { k: '巌', r: 'ガン' }],
    21: [{ k: '警', r: 'ケイ' }, { k: '魔', r: 'マ' }, { k: '鶴', r: 'ツル' }, { k: '櫻', r: 'サクラ' }, { k: '露', r: 'ロ' }, { k: '顧', r: 'コ' }, { k: '艦', r: 'カン' }, { k: '躍', r: 'ヤク' }, { k: '饒', r: 'ジョウ' }, { k: '轟', r: 'ゴウ' }, { k: '辯', r: 'ベン' }, { k: '瓏', r: 'ロウ' }, { k: '籐', r: 'トウ' }, { k: '欅', r: 'ケヤキ' }, { k: '誉', r: 'ホマレ' }],
    22: [{ k: '驚', r: 'キョウ' }, { k: '襲', r: 'シュウ' }, { k: '鑑', r: 'カン' }, { k: '籠', r: 'カゴ' }, { k: '讀', r: 'ドク' }, { k: '鑄', r: 'イ' }, { k: '權', r: 'ケン' }, { k: '歡', r: 'カン' }, { k: '聽', r: 'チョウ' }, { k: '贖', r: 'ショク' }, { k: '鷗', r: 'オウ' }, { k: '疊', r: 'ジョウ' }, { k: '聾', r: 'ロウ' }, { k: '龔', r: 'キョウ' }, { k: '顫', r: 'セン' }],
    23: [{ k: '恋', r: 'レン' }, { k: '変', r: 'ヘン' }, { k: '蘭', r: 'ラン' }, { k: '鷲', r: 'ワシ' }, { k: '麟', r: 'リン' }, { k: '顕', r: 'ケン' }, { k: '驗', r: 'ケン' }, { k: '體', r: 'タイ' }, { k: '驛', r: 'エキ' }, { k: '罐', r: 'カン' }, { k: '顯', r: 'ケン' }, { k: '巖', r: 'ガン' }, { k: '戀', r: 'レン' }, { k: '纓', r: 'エイ' }, { k: '鑛', r: 'コウ' }],
    24: [{ k: '鷹', r: 'タカ' }, { k: '鷺', r: 'サギ' }, { k: '麟', r: 'リン' }, { k: '琴', r: 'キン' }, { k: '讓', r: 'ジョウ' }, { k: '釀', r: 'ジョウ' }, { k: '靈', r: 'レイ' }, { k: '鹽', r: 'エン' }, { k: '囑', r: 'ショク' }, { k: '廳', r: 'チョウ' }, { k: '灣', r: 'ワン' }, { k: '籬', r: 'リ' }, { k: '齷', r: 'アク' }, { k: '矗', r: 'チク' }, { k: '蠶', r: 'サン' }]
}; // Simplified list. In production, this should be fetched from a comprehensive database.

/* Removed loadKanjiData function as we use hardcoded KANJI_DATA */

// Event Listeners
analyzeBtn.addEventListener('click', handleAnalyze);
recalcBtn.addEventListener('click', () => calculateAndDisplay(currentSurnameStrokes));
if (closeModal) closeModal.addEventListener('click', () => kanjiModal.classList.add('hidden'));
window.addEventListener('click', (e) => {
    if (e.target === kanjiModal) kanjiModal.classList.add('hidden');
});

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

        // Add click listener for modal
        row.addEventListener('click', () => openKanjiModal(item.nameStrokes, item.weightedScore));

        // Format name like "3+15"
        let patternText = item.nameStrokes.join('+') + '画';

        row.innerHTML = `
            <div class="col-name">
                <span class="name-pattern">${patternText}</span>
                <span class="score-pill" style="background:${getScoreColor(item.weightedScore)}">${item.weightedScore}pt</span>
                <span class="tap-hint">タップで漢字候補</span>
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
                    <span class="k-char">${c.k}</span>
                    <span class="k-read">${c.r}</span>
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
