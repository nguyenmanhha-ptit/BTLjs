function dinhgiatien(tien) {
    return tien.toLocaleString('vi-VN') + 'đ';
}
console.log(dinhgiatien(1000000));

function tinhphantram(giagoc, giamoi) {
    if (giagoc && giagoc > giamoi) {
        return Math.round((1 - giamoi / giagoc) * 100) + '%'
    }
    else {
        return 0
    }
}

function hienthisao(danhgia) {
    let sao = ""
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(danhgia)) {
            sao += "★"
        }
        else if (i === Math.floor(danhgia) + 1 && danhgia % 1 >= 0.5) {
            sao += "⯨"
        }
        else {
            sao += "☆"
        }
    }
    return sao
}
console.log(hienthisao(3.5))
