'use strict';

export var filterName = 'bihuCompany';

const Companies = {
  1: '太平洋',
  2: '平安',
  4: '人保'
};

// 00000000001 太平洋 1
// 00000000010 平安 2
// 00000000100 人保 4
// 00000001000 国寿财 8
// 00000010000 中华联合 16
// 00000100000 大地 32
// 00001000000 阳光 64
// 00010000000 太平保险 128
// 00100000000 华安 256
// 01000000000 天安 512
// 10000000000 英大 1024

class BihuCompanyFilter {

  static filter() {
    return (input) => {
      return Companies[input];
    };
  }

}

export class Filter extends BihuCompanyFilter {}