import {symbols} from './symbolTable';
import {Token, Symbol, Num, Macro, Structure, Matrix, Formula, FontStyle, StructType, BigOpr, Accent} from './formula';
import {Decoration, StrokeStyle, Diagram, LabelPosotion, Arrow} from './diagram';
import * as util from './util';

export {symbols} from './symbolTable';

let proofMode = false;

const amsBracket = {
	"()": "p",
	"[]": "b",
	"{}": "B",
	"||": "v",
	"‖‖": "V",
	"": ""
};

export const styles: { [key: string]: FontStyle } = {
	"mathbf": FontStyle.Bold,
	"mathrm": FontStyle.Roman,
	"mathscr": FontStyle.Script,
	"mathfrak": FontStyle.Fraktur,
	"mathbb": FontStyle.BlackBoard,
	"mathtt": FontStyle.Typewriter
};

export const accentSymbols: { [key: string]: string } = {
	"←": "overleftarrow",
	"→": "overrightarrow",
	"～": "widetilde",
	"＾": "widehat",
	"‾": "overline",
	"_": "underline",
	"︷": "overbrace",
	"︸": "underbrace"
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
		proofMode = proof;
	if (indent == undefined)
		indent = "";

	if (t instanceof Symbol)
	{
		return transSymbol((<Symbol> t).str, indent);
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
			+ transDiagram(d, indent)
			+ "}";
	}
	else if (t instanceof Matrix)
	{
		var m = <Matrix> t;

		var opt = "";
		for (var i = 0; i < m.cols; i++)
			opt += "c";

		return "\\begin{array}{" + opt + "}"
			+ transMatrix(m, indent)
			+ "\\end{array}";
	}
	else if (t instanceof Structure)
	{
		return transStructure(<Structure> t, indent);
	}
	else if (t instanceof Formula)
	{
		return transFormula(<Formula> t, indent);
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

	if (proofMode)
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
			return "\\" + accentSymbols[(<Accent> s).symbol]
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

		if (br in amsBracket)	// incomplete condition
		{
			var n = amsBracket[br];
			return "\\begin{" + n + "matrix}"
				+ transMatrix(<Matrix> f.tokens[0], indent)
				+ "\\end{" + n + "matrix}";
		}
	}

	var separator = " ";
	var pre: string, suf: string;

	if (f.style != FontStyle.Normal)
	{
		var cmd: string;

		for (cmd in styles)
			if (styles[cmd] == f.style)
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
		pre = transSymbol(f.prefix, indent);
		suf = transSymbol(f.suffix, indent);

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
