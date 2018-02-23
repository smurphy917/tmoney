export function ArraySum(arr:number[]):number{
    return arr.reduce((a,b) => a+b,0);
}

export function RoundDigits(num:number,digits:number){
    digits = Math.round(digits); //ensure we have an integer number of digits;
    return Number(Math.round(Number(num + 'e' + digits)) + 'e-' + digits);
}