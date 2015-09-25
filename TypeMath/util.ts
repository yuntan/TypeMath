export function trimEnd<T>(a: T[], predicate: (x: T) => boolean)
{
	if (predicate(a[a.length - 1]))
		a.pop();
}
export function groupBy<T1, T2>(a: T1[], f: (x: T1) => T2): T1[][]
{
	var r: T1[][] = [];
	var b = a.map(x => ({ key: x, value: f(x) }));

	while (b.length > 0)
	{
		var p = b.shift();
		var s: T1[] = [p.key];
		for (var j = 0; j < b.length; j++)
			if (b[j].value == p.value)
				s.push(b.splice(j--, 1)[0].key);
		r.push(s);
	}

	return r;
}
export function concat<T>(a: T[][]): T[]
{
	return a.reduce((ac, x) => ac.concat(x), []);
}
export function repeat<T>(elem: T, count: number): T[]
{
	return num(count).map(() => elem);
}
export function num(count: number): number[]
{
	return range(0, count);
}
export function range(from: number, count: number, step?: number): number[]
{
	var r: number[] = [];

	if (step === undefined)
		step = 1;

	for (var i = 0; i < count; i++)
		r.push(from + i * step);

	return r;
}
export function normSquared(x: number, y: number): number
{
	return x * x + y * y;
}
