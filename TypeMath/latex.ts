import {Token, Symbol, Num, Macro, Structure, Matrix, Formula, FontStyle, StructType, BigOpr, Accent} from './formula';
import {Decoration, StrokeStyle, Diagram, LabelPosotion, Arrow} from './diagram';
import * as util from './util';

let proofMode = false;

let amsBracket = {
	"()": "p",
	"[]": "b",
	"{}": "B",
	"||": "v",
	"‖‖": "V",
	"": ""
};

export let styles: { [key: string]: FontStyle } = {
	"mathbf": FontStyle.Bold,
	"mathrm": FontStyle.Roman,
	"mathscr": FontStyle.Script,
	"mathfrak": FontStyle.Fraktur,
	"mathbb": FontStyle.BlackBoard,
	"mathtt": FontStyle.Typewriter
};

export let accentSymbols: { [key: string]: string } = {
	"←": "overleftarrow",
	"→": "overrightarrow",
	"～": "widetilde",
	"＾": "widehat",
	"‾": "overline",
	"_": "underline",
	"︷": "overbrace",
	"︸": "underbrace"
};

export let symbols: { [key: string]: string } = {
    "̀": "grave",
    "́": "acute",
    "̂": "hat",
    "̃": "tilde",
    "̄": "bar",
    "̆": "breve",
    "̇": "dot",
    "̈": "ddot",
    "̊": "mathring",
    "̌": "check",
    "arccos": "arccos",
    "arcsin": "arcsin",
    "arctan": "arctan",
    "arg": "arg",
    "cos": "cos",
    "cosh": "cosh",
    "cot": "cot",
    "coth": "coth",
    "csc": "csc",
    "deg": "deg",
    "det": "det",
    "dim": "dim",
    "exp": "exp",
    "gcd": "gcd",
    "hom": "hom",
    "inf": "inf",
    "ker": "ker",
    "lg": "lg",
    "lim": "lim",
    "liminf": "liminf",
    "limsup": "limsup",
    "ln": "ln",
    "log": "log",
    "max": "max",
    "min": "min",
    "Pr": "Pr",
    "sec": "sec",
    "sin": "sin",
    "sinh": "sinh",
    "sup": "sup",
    "tan": "tan",
    "tanh": "tanh",
    "mod": "bmod",
    "‖": "Vert",
    "{": "{",
    "}": "}",
    "ł": "l",
    "Ł": "L",
    "ø": "o",
    "Ø": "O",
    "ı": "i",
    "ȷ": "j",
    "ß": "ss",
    "æ": "ae",
    "Æ": "AE",
    "œ": "oe",
    "Œ": "OE",
    "å": "aa",
    "Å": "AA",
    "©": "copyright",
    "£": "pounds",
    "…": "dots",
    "⋯": "cdots",
    "⋮": "vdots",
    "⋱": "ddots",
    "ℓ": "ell",
    "𝚤": "imath",
    "𝚥": "jmath",
    "℘": "wp",
    "ℜ": "Re",
    "ℑ": "Im",
    "ℵ": "aleph",
    "∂": "partial",
    "∞": "infty",
    "′": "prime",
    "∅": "emptyset",
    "\\": "backslash",
    "∀": "forall",
    "∃": "exists",
    //"∫": "smallint",
    "△": "triangle",
    "√": "surd",
    "⟙": "top",
    "⟘": "bot",
    "¶": "P",
    "§": "S",
    "♭": "flat",
    "♮": "natural",
    "♯": "sharp",
    "☘": "clubsuit",
    "♢": "diamondsuit",
    "♡": "heartsuit",
    "♠": "spadesuit",
    "¬": "neg",
    "∇": "nabla",
    "□": "Box",
    "◇": "Diamond",
    "±": "pm",
    "∓": "mp",
    "×": "times",
    "÷": "div",
    "∗": "ast",
    "⋆": "star",
    "◦": "circ",
    "∙": "bullet",
    "·": "cdot",
    "∩": "cap",
    "∪": "cup",
    "⊓": "sqcap",
    "⊔": "sqcup",
    "∨": "vee",
    "∧": "wedge",
    "∖": "setminus",
    "≀": "wr",
    "⋄": "diamond",
    "†": "dagger",
    "‡": "ddagger",
    "⨿": "amalg",
    //"△": "bigtriangleup",
    //"▽": "bigtriangledown",
    "◁": "triangleleft",
    "▷": "triangleright",
    "⊲": "lhd",
    "⊳": "rhd",
    "⊴": "unlhd",
    "⊵": "unrhd",
    "⊎": "uplus",
    "⊕": "oplus",
    "⊖": "ominus",
    "⊗": "otimes",
    "⊘": "oslash",
    "⊙": "odot",
    "○": "bigcirc",
    "∑": "sum",
    "⋂": "bigcap",
    "⨀": "bigodot",
    "∏": "prod",
    "⋃": "bigcup",
    "⨂": "bigotimes",
    "∐": "coprod",
    "⨆": "bigsqcup",
    "⨁": "bigoplus",
    "∫": "int",
    "⋁": "bigvee",
    "⨄": "biguplus",
    "∮": "oint",
    "⋀": "bigwedge",
    "≤": "leq",
    "≥": "geq",
    "≺": "prec",
    "≻": "succ",
    "⪯": "preceq",
    "⪰": "succeq",
    "≪": "ll",
    "≫": "gg",
    "⊂": "subset",
    "⊃": "supset",
    "⊆": "subseteq",
    "⊇": "supseteq",
    "⊑": "sqsubseteq",
    "⊒": "sqsupseteq",
    "∈": "in",
    "∋": "ni",
    "⊢": "vdash",
    "⊣": "dashv",
    "≡": "equiv",
    "⊧": "models",
    "∼": "sim",
    "⟂": "perp",
    "≃": "simeq",
    "∝": "propto",
    "∣": "mid",
    "≍": "asymp",
    "∥": "parallel",
    "≈": "approx",
    "⋈": "bowtie",
    "≅": "cong",
    "⨝": "Join",
    "∉": "notin",
    "≠": "neq",
    "⌣": "smile",
    "≐": "doteq",
    "⌢": "frown",
    "⌊": "lfloor",
    "⌋": "rfloor",
    "⌈": "lceil",
    "⌉": "rceil",
    "〈": "langle",
    "〉": "rangle",
    "←": "leftarrow",
    "⟵": "longleftarrow",
    "⇐": "Leftarrow",
    "⟸": "Longleftarrow",
    "→": "rightarrow",
    "⟶": "longrightarrow",
    "⇒": "Rightarrow",
    "⟹": "Longrightarrow",
    "↔": "leftrightarrow",
    "⟷": "longleftrightarrow",
    "⇔": "Leftrightarrow",
    "⟺": "Longleftrightarrow",
    "↦": "mapsto",
    "⟼": "longmapsto",
    "↩": "hookleftarrow",
    "↪": "hookrightarrow",
    "↼": "leftharpoonup",
    "⇀": "rightharpoonup",
    "↽": "leftharpoondown",
    "⇁": "rightharpoondown",
    "↝": "leadsto",
    "↑": "uparrow",
    "⇑": "Uparrow",
    "↓": "downarrow",
    "⇓": "Downarrow",
    "↕": "updownarrow",
    "⇕": "Updownarrow",
    "↗": "nearrow",
    "↘": "searrow",
    "↙": "swarrow",
    "↖": "nwarrow",
    "α": "alpha",
    "β": "beta",
    "γ": "gamma",
    "δ": "delta",
    "ϵ": "epsilon",
    "ζ": "zeta",
    "η": "eta",
    "θ": "theta",
    "ι": "iota",
    "κ": "kappa",
    "λ": "lambda",
    "μ": "mu",
    "ν": "nu",
    "ξ": "xi",
    "π": "pi",
    "ρ": "rho",
    "σ": "sigma",
    "τ": "tau",
    "υ": "upsilon",
    "ϕ": "phi",
    "χ": "chi",
    "ψ": "psi",
    "ω": "omega",
    "Γ": "Gamma",
    "Δ": "Delta",
    "Θ": "Theta",
    "Λ": "Lambda",
    "Ξ": "Xi",
    "Π": "Pi",
    "Σ": "Sigma",
    "Υ": "Upsilon",
    "Φ": "Phi",
    "Ψ": "Psi",
    "Ω": "Omega",
    "ε": "varepsilon",
    "ϑ": "vartheta",
    "ϖ": "varpi",
    "ϱ": "varrho",
    "ς": "varsigma",
    "φ": "varphi",
    "ħ": "hbar",
    "ℏ": "hslash",
    "𝕜": "Bbbk",
    //"□": "square",
    "■": "blacksquare",
    "Ⓢ": "circledS",
    "▲": "blacktriangle",
    "▽": "triangledown",
    "▼": "blacktriangledown",
    "∁": "complement",
    "⅁": "Game",
    "◊": "lozenge",
    "⧫": "blacklozenge",
    "★": "bigstar",
    "∠": "angle",
    "∡": "measuredangle",
    "∢": "sphericalangle",
    "／": "diagup",
    "＼": "diagdown",
    "‵": "backprime",
    "Ⅎ": "Finv",
    "℧": "mho",
    "ð": "eth",
    "∄": "nexists",
    "≑": "doteqdot",
    "≓": "risingdotseq",
    "≒": "fallingdotseq",
    "≖": "eqcirc",
    "≗": "circeq",
    "≏": "bumpeq",
    "≎": "Bumpeq",
    "⋖": "lessdot",
    "⋗": "gtrdot",
    "⩽": "leqslang",
    "⩾": "geqslant",
    "⪕": "eqslantless",
    "⪖": "eqslantgtr",
    "≦": "leqq",
    "≧": "geqq",
    "⋘": "lll",
    "⋙": "ggg",
    "≲": "lesssim",
    "≳": "gtrsim",
    "⪅": "lessapprox",
    "⪆": "gtrapprox",
    "≶": "lessgtr",
    "≷": "gtrless",
    "⋚": "lesseqgtr",
    "⋛": "gtreqless",
    "⪋": "lesseqqgtr",
    "⪌": "gtreqqless",
    "∽": "backsim",
    "⋍": "backsimeq",
    "≼": "preccurlyeq",
    "≽": "succcurlyeq",
    "≊": "approxeq",
    "⋞": "curlyeqprec",
    "⋟": "curlyeqsucc",
    "≾": "precsim",
    "≿": "succsim",
    "⪷": "precapprox",
    "⪸": "succapprox",
    "⫅": "subseteqq",
    "⫆": "supseteqq",
    "⋐": "Subset",
    "⋑": "Supset",
    "⊏": "sqsubset",
    "⊐": "sqsupset",
    "⊨": "vDash",
    "⊩": "Vdash",
    "⊪": "Vvdash",
    "϶": "backepsilon",
    "∴": "therefore",
    "∵": "because",
    "≬": "between",
    "⋔": "pitchfork",
    //"⊲": "vartriangleleft",
    //"⊳": "vartriangleright",
    "◀": "blacktriangleleft",
    "▶": "blacktriangleright",
    //"⊴": "trianglelefteq",
    //"⊵": "trianglerighteq",
    "∔": "dotplus",
    //"·": "centerdot",
    "⋉": "ltimes",
    "⋊": "rtimes",
    "⋋": "leftthreetimes",
    "⋌": "rightthreetimes",
    "⊝": "circleddash",
    "⌅": "barwedge",
    "⌆": "doubebarwedge",
    "⋏": "curlywedge",
    "⋎": "curlyvee",
    "⊻": "veebar",
    "⊺": "intercal",
    "⋒": "Cap",
    "⋓": "Cup",
    "⊛": "circledast",
    "⊚": "circledcirc",
    "⊟": "boxminus",
    "⊠": "boxtimes",
    "⊡": "boxdot",
    "⊞": "boxplus",
    "⋇": "divideontimes",
    "&": "And",
    "∬": "iint",
    "∭": "iiint",
    "⨌": "iiiint",
    "⤎": "dashleftarrow",
    "⤏": "dashrightarrow",
    "⇇": "leftleftarrows",
    "⇉": "rightrightarrows",
    "⇈": "upuparrows",
    "⇊": "downdownarrows",
    "⇆": "leftrightarrows",
    "⇄": "rightleftarrows",
    "⇚": "Lleftarrow",
    "⇛": "Rrightarrow",
    "↿": "upharpoonleft",
    "↾": "upharpoonright",
    "↞": "twoheadleftarrow",
    "↠": "twoheadrightarrow",
    "↢": "leftarrowtail",
    "↣": "rightarrowtail",
    "⇃": "downharpoonleft",
    "⇂": "downharpoonright",
    "⇋": "leftrightharpoons",
    "⇌": "rightleftharpoons",
    "↰": "Lsh",
    "↱": "Rsh",
    "⇝": "rightsquigarrow",
    "↫": "looparrowleft",
    "↬": "looparrowright",
    "↭": "leftrightsquigarrow",
    "⊸": "multimap",
    "↶": "curvearrowleft",
    "↷": "curvearrowright",
    "↺": "circlearrowleft",
    "↻": "circlearrowright",
    "≮": "nless",
    "≯": "ngtr",
    "⪇": "lneq",
    "⪈": "gneq",
    "≰": "nleq",
    "≱": "ngeq",
    "≨": "lneqq",
    "≩": "gneqq",
    "∤": "nmid",
    "∦": "nparallel",
    "⋦": "lnsim",
    "⋧": "gnsim",
    "≁": "nsim",
    "≇": "ncong",
    "⊀": "nprec",
    "⊁": "nsucc",
    "⪵": "precneqq",
    "⪶": "succneqq",
    "⋨": "precnsim",
    "⋩": "succnsim",
    "⪉": "precnapprox",
    "⪊": "succnapprox",
    "⊊": "subsetneq",
    "⊋": "supsetneq",
    "⋪": "ntriangleleft",
    "⋫": "ntriangleright",
    "⋬": "ntrianglelefteq",
    "⋭": "ntrianglerighteq",
    "⊈": "nsubseteq",
    "⊉": "nsupseteq",
    "⫋": "subsetneqq",
    "⫌": "supsetneqq",
    "⊬": "nvdash",
    "⊭": "nvDash",
    "⊮": "nVdash",
    "⊯": "nVDash",
    "↚": "nleftarrow",
    "↛": "nrightarrow",
    "↮": "nleftrightarrow",
    "⇎": "nLeftrightarrow",
    "⇍": "nLeftarrow",
    "⇏": "nRightarrow"
};

let combiningAccents: string[] = ["̀", "́", "̂", "̃", "̄", "̆", "̇", "̈", "̊", "̌"];

function macro(n: string, ...args: Token[]): string
{
	return "\\" + n + "{ " + args.map(t => trans(t)).join(" }{ ") + " }";
}

function macroBroken(n: string, indent: string, ...args: Token[]): string
{
	var inner = indent + "  ";
	return "\\" + n + " {\n"
		+ inner + args.map(t => trans(t, inner)).join("\n" + indent + "}{\n" + inner) + "\n"
		+ indent + "}";
}

export function trans(t: Token, indent?: string, proof?: boolean): string
{
	if (proof != undefined)
		this.proofMode = proof;
	if (indent == undefined)
		indent = "";

	if (t instanceof Symbol)
	{
		return this.transSymbol((<Symbol> t).str, indent);
	}
	else if (t instanceof Num)
	{
		return (<Num> t).value.toString();
	}
	else if (t instanceof Macro)
	{
		var mc = <Macro> t;
		return "\\" + mc.name
			+ (mc.elems.length > 0
				? "{ " + mc.elems.map(e => trans(e)).join(" }{ ") + " }" : "");
	}
	else if (t instanceof Diagram)
	{
		var d = <Diagram> t;

		return "\\xymatrix {"
			+ this.transDiagram(d, indent)
			+ "}";
	}
	else if (t instanceof Matrix)
	{
		var m = <Matrix> t;

		var opt = "";
		for (var i = 0; i < m.cols; i++)
			opt += "c";

		return "\\begin{array}{" + opt + "}"
			+ this.transMatrix(m, indent)
			+ "\\end{array}";
	}
	else if (t instanceof Structure)
	{
		return this.transStructure(<Structure> t, indent);
	}
	else if (t instanceof Formula)
	{
		return this.transFormula(<Formula> t, indent);
	}
	else
		return "?";
}
function transSymbol(str: string, indent: string): string
{
	var s = str.charAt(str.length - 1);
	if (combiningAccents.indexOf(s) >= 0)
	{
		return "\\" + symbols[s] + "{" + transSymbol(str.slice(0, -1), indent) + "}";
	}

	if (this.proofMode)
	{
		switch (str)
		{
			case "&":
				return "&\n" + indent.slice(0, -1);
			case "∧":
				return "\\land";
			case "∨":
				return "\\lor";
			case "¬":
			case "￢":
				return "\\lnot";
		}
	}

	if (str in symbols)
		return "\\" + symbols[str];
	else
		return str;
}
function transDiagram(d: Diagram, indent: string): string
{
	var ln = "\n";
	var str = "";

	str += ln;
	for (var i = 0; i < d.rows; i++)
	{
		str += d.elems.slice(d.cols * i, d.cols * (i + 1))
			.map((o, j) =>
			{
				var s = trans(o);
				var dec = transDecoration(d.decorations[i][j]);
				if (dec != "")
					s = "*" + dec + "{" + s + "}";
				s += util.groupBy(d.arrows[i][j], a => a.to.row * d.cols + a.to.col)
					.map(as => as.map((a, k) => transArrow(a, k - (as.length - 1) / 2)).join(" ")).join(" ");
				return s;
			}).join(" & ") + " \\\\" + ln;
	}

	return str;
}
function transDecoration(deco: Decoration): string
{
	if (!deco)
		return "";

	var s = "";

	if (deco.size != 0)
		s = util.repeat((deco.size > 0 ? "+" : "-"), Math.abs(deco.size)).join("");

	if (deco.circle)
		s += "[o]";

	switch (deco.style)
	{
		case StrokeStyle.Plain: s += "[F" + (deco.double ? "=" : "-") + "]"; break;
		case StrokeStyle.Dashed: s += "[F--]"; break;
		case StrokeStyle.Dotted: s += "[F.]"; break;
		case StrokeStyle.Wavy: s += "[F~]"; break;
	}

	return s;
}
function transArrow(a: Arrow, shift: number): string
{
	var s = "";
	var style = "";
	var doubled = false;

	switch (a.style)
	{
		case StrokeStyle.Plain: style = ((doubled = a.num == 2) ? "=" : "-"); break;
		case StrokeStyle.Dashed: style = ((doubled = a.num == 2) ? "==" : "--"); break;
		case StrokeStyle.Dotted: style = ((doubled = a.num == 2) ? ":" : "."); break;
		case StrokeStyle.Wavy: style = "~"; break;
	}
	style += a.head;
	if (style != "->")
		style = "{" + style + "}";
	else
		style = "";
	if (!doubled && a.num != 1)
		style = a.num.toString() + style;
	if (shift)
		style += "<" + shift.toString() + "ex>";

	s += (style != "" ? "\\ar@" + style : "\\ar");

	var dir = "";
	var dc = a.to.col - a.from.col;
	var dr = a.to.row - a.from.row;
	if (dc != 0)
		dir = util.repeat((dc > 0 ? "r" : "l"), Math.abs(dc)).join();
	if (dr != 0)
		dir += util.repeat((dr > 0 ? "d" : "u"), Math.abs(dr)).join();
	s += "[" + dir + "]";

	if (!a.label.empty())
	{
		if (a.labelPos == LabelPosotion.Middle)
			s += " |";
		else if (a.labelPos == LabelPosotion.Right)
			s += "_";
		else
			s += "^";

		var t = trans(a.label);
		if (t.length > 1)
			t = "{" + t + "}";
		s += t;
	}

	return s;
}
function transMatrix(m: Matrix, indent: string): string
{
	var ln = (m.rows >= 2 && m.cols >= 2 && !(m.rows == 2 && m.cols == 2))
		? "\n" : " ";
	var str = "";

	str += ln;
	for (var i = 0; i < m.rows; i++)
	{
		str += m.elems.slice(m.cols * i, m.cols * (i + 1))
			.map(f => trans(f)).join(" & ")
		+ " \\\\" + ln;
	}

	return str;
}
function transStructure(s: Structure, indent: string): string
{
	var str: string;

	switch (s.type)
	{
		case StructType.Frac:
			return macro("frac", s.token(0), s.token(1));
		case StructType.Infer:
			var opt = trans(s.token(2));
			return macroBroken("infer" + (opt != "" ? "[" + opt + "]" : ""),
				indent, s.token(0), s.token(1));
		case StructType.Power:
			str = trans(s.token(0));
			return str.length == 1
				? "^" + str
				: "^{ " + str + " }";
		case StructType.Index:
			str = trans(s.token(0));
			return str.length == 1
				? "_" + str
				: "_{ " + str + " }";
		case StructType.BigOpr:
			return transSymbol((<BigOpr> s).operator, indent)
				+ "_{" + trans(s.elems[0])
				+ "}^{" + trans(s.elems[1]) + "}";
			break;
		case StructType.Accent:
			return "\\" + this.accentSymbols[(<Accent> s).symbol]
				+ "{" + trans(s.elems[0]) + "}";
			break;
		default:
			return "?struct?";
	}
}
function transFormula(f: Formula, indent: string): string
{
	if (f.tokens.length == 1 && f.tokens[0] instanceof Matrix
		&& !(f.tokens[0] instanceof Diagram))
	{
		var br = f.prefix + f.suffix;

		if (br in this.amsBracket)	// incomplete condition
		{
			var n = this.amsBracket[br];
			return "\\begin{" + n + "matrix}"
				+ this.transMatrix(<Matrix> f.tokens[0], indent)
				+ "\\end{" + n + "matrix}";
		}
	}

	var separator = " ";
	var pre, suf: string;

	if (f.style != FontStyle.Normal)
	{
		var cmd: string;

		for (cmd in this.styles)
			if (this.styles[cmd] == f.style)
			{
				pre = "\\" + cmd + "{";
				suf = "}";
				break;
			}

		if (f.tokens.every(t => t instanceof Symbol || t instanceof Num))
			separator = "";
	}
	else if (f.prefix == "√" && f.suffix == "")
	{
		pre = "\\sqrt{ ";
		suf = " }";
	}
	else
	{
		pre = this.transSymbol(f.prefix, indent);
		suf = this.transSymbol(f.suffix, indent);

		if (pre != "")
			pre = "\\left" + pre + " ";
		else if (suf != "")
			pre = "\\left. ";
		if (suf != "")
			suf = " \\right" + suf;
		else if (pre != "")
			suf = " \\right.";
	}

	return pre + f.tokens.map(t => trans(t, indent)).join(separator) + suf;
}
