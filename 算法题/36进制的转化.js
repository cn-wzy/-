function getNum36() {
    let nums36 = [];
    for (let i = 0; i < 36; i++) {
        if (i>=0 && i<9) {
            nums36.push(i);
        } else {
            nums36.push(String.fromCharCode(i + 87));
        }
    }
    return nums36;
}
function tenTurnTo36(n) {
    let ans = [];
    let nums36 = getNum36();
    while (n) {
        let res = n % 36;
        ans.unshift(nums36[res]);
        n = parseInt( n / 36);
    }
    return ans.join("");
}