export function ArraySum(arr:number[]):number{
    return arr.reduce((a,b) => a+b,0);
}