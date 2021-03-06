$.fn.setUrduInput = function(t) { var n = { q: "ق", w: "و", e: "ع", r: "ر", t: "ت", y: "ے", u: "ء", i: "ی", o: "ہ", p: "پ", a: "ا", s: "س", d: "د", f: "ف", g: "گ", h: "ح", j: "ج", k: "ک", l: "ل", z: "ز", x: "ش", c: "چ", v: "ط", b: "ب", n: "ن", m: "م", "`": "ً", ",": "،", ".": "۔", Q: "ْ", W: "ّ", E: "ٰ", R: "ڑ", T: "ٹ", Y: "َ", U: "ئ", I: "ِ", O: "ۃ", P: "ُ", A: "آ", S: "ص", D: "ڈ", G: "غ", H: "ھ", J: "ض", K: "خ", Z: "ذ", X: "ژ", C: "ث", V: "ظ", N: "ں", M: "٘", "~": "ٍ", "?": "؟", F: "ٔ", L: "ل", B: "ب" },
        i = { 0: "۰", 1: "۱", 2: "۲", 3: "۳", 4: "۴", 5: "۵", 6: "۶", 7: "۷", 8: "۸", 9: "۹" };
    t && t.urduNumerals && $.extend(n, i); var s = "";
    $(this).bind("input", function() { var t = $(this)[0].selectionEnd,
            i = $(this).val(),
            e = t == i.length; if (s != i) { for (var a = [], h = 0; h < i.length; h++) { var r = i.charAt(h);
                a.push(n[r] || r) }
            $(this).val(a.join("")), s = $(this).val(), e || ($(this)[0].selectionStart = $(this)[0].selectionEnd = t) } }) };