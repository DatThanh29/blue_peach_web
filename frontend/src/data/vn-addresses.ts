export type WardOption = {
  code: string;
  name: string;
  type?: string;
};

export type ProvinceOption = {
  code: string;
  name: string;
  wards: WardOption[];
};

export const VN_ADDRESS_OPTIONS: ProvinceOption[] = [
  {
    "code": "17",
    "name": "An Giang",
    "wards": [
      {
        "code": "25873",
        "name": "Đặc Khu Kiên Hải",
        "type": "dac-khu"
      },
      {
        "code": "25617",
        "name": "Đặc Khu Phú Quốc",
        "type": "dac-khu"
      },
      {
        "code": "15889",
        "name": "Đặc Khu Thổ Châu",
        "type": "dac-khu"
      },
      {
        "code": "3857",
        "name": "Phường Bình Đức",
        "type": "phuong"
      },
      {
        "code": "1553",
        "name": "Phường Châu Đốc",
        "type": "phuong"
      },
      {
        "code": "9745",
        "name": "Phường Chi Lăng",
        "type": "phuong"
      },
      {
        "code": "16401",
        "name": "Phường Hà Tiên",
        "type": "phuong"
      },
      {
        "code": "5137",
        "name": "Phường Long Phú",
        "type": "phuong"
      },
      {
        "code": "3601",
        "name": "Phường Long Xuyên",
        "type": "phuong"
      },
      {
        "code": "4113",
        "name": "Phường Mỹ Thới",
        "type": "phuong"
      },
      {
        "code": "16145",
        "name": "Phường Rạch Giá",
        "type": "phuong"
      },
      {
        "code": "4881",
        "name": "Phường Tân Châu",
        "type": "phuong"
      },
      {
        "code": "8977",
        "name": "Phường Thới Sơn",
        "type": "phuong"
      },
      {
        "code": "9233",
        "name": "Phường Tịnh Biên",
        "type": "phuong"
      },
      {
        "code": "16657",
        "name": "Phường Tô Châu",
        "type": "phuong"
      },
      {
        "code": "1297",
        "name": "Phường Vĩnh Tế",
        "type": "phuong"
      },
      {
        "code": "1041",
        "name": "Phường Vĩnh Thông",
        "type": "phuong"
      },
      {
        "code": "22801",
        "name": "Xã An Biên",
        "type": "xa"
      },
      {
        "code": "11537",
        "name": "Xã An Châu",
        "type": "xa"
      },
      {
        "code": "9489",
        "name": "Xã An Cư",
        "type": "xa"
      },
      {
        "code": "23825",
        "name": "Xã An Minh",
        "type": "xa"
      },
      {
        "code": "1809",
        "name": "Xã An Phú",
        "type": "xa"
      },
      {
        "code": "10257",
        "name": "Xã Ba Chúc",
        "type": "xa"
      },
      {
        "code": "18705",
        "name": "Xã Bình An",
        "type": "xa"
      },
      {
        "code": "2065",
        "name": "Xã Bình Giang",
        "type": "xa"
      },
      {
        "code": "11793",
        "name": "Xã Bình Hòa",
        "type": "xa"
      },
      {
        "code": "8465",
        "name": "Xã Bình Mỹ",
        "type": "xa"
      },
      {
        "code": "2321",
        "name": "Xã Bình Sơn",
        "type": "xa"
      },
      {
        "code": "6673",
        "name": "Xã Bình Thạnh Đông",
        "type": "xa"
      },
      {
        "code": "12049",
        "name": "Xã Cần Đăng",
        "type": "xa"
      },
      {
        "code": "5649",
        "name": "Xã Châu Phong",
        "type": "xa"
      },
      {
        "code": "8209",
        "name": "Xã Châu Phú",
        "type": "xa"
      },
      {
        "code": "18449",
        "name": "Xã Châu Thành",
        "type": "xa"
      },
      {
        "code": "13585",
        "name": "Xã Chợ Mới",
        "type": "xa"
      },
      {
        "code": "6929",
        "name": "Xã Chợ Vàm",
        "type": "xa"
      },
      {
        "code": "11025",
        "name": "Xã Cô Tô",
        "type": "xa"
      },
      {
        "code": "12817",
        "name": "Xã Cù Lao Giêng",
        "type": "xa"
      },
      {
        "code": "21265",
        "name": "Xã Định Hòa",
        "type": "xa"
      },
      {
        "code": "14865",
        "name": "Xã Định Mỹ",
        "type": "xa"
      },
      {
        "code": "23057",
        "name": "Xã Đông Hòa",
        "type": "xa"
      },
      {
        "code": "23569",
        "name": "Xã Đông Hưng",
        "type": "xa"
      },
      {
        "code": "22545",
        "name": "Xã Đông Thái",
        "type": "xa"
      },
      {
        "code": "16913",
        "name": "Xã Giang Thành",
        "type": "xa"
      },
      {
        "code": "19729",
        "name": "Xã Giồng Riềng",
        "type": "xa"
      },
      {
        "code": "21521",
        "name": "Xã Gò Quao",
        "type": "xa"
      },
      {
        "code": "785",
        "name": "Xã Hòa Điền",
        "type": "xa"
      },
      {
        "code": "20497",
        "name": "Xã Hòa Hưng",
        "type": "xa"
      },
      {
        "code": "7185",
        "name": "Xã Hòa Lạc",
        "type": "xa"
      },
      {
        "code": "21009",
        "name": "Xã Hòa Thuận",
        "type": "xa"
      },
      {
        "code": "17425",
        "name": "Xã Hòn Đất",
        "type": "xa"
      },
      {
        "code": "273",
        "name": "Xã Hòn Nghệ",
        "type": "xa"
      },
      {
        "code": "13073",
        "name": "Xã Hội An",
        "type": "xa"
      },
      {
        "code": "4625",
        "name": "Xã Khánh Bình",
        "type": "xa"
      },
      {
        "code": "26129",
        "name": "Xã Kiên Lương",
        "type": "xa"
      },
      {
        "code": "13329",
        "name": "Xã Long Điền",
        "type": "xa"
      },
      {
        "code": "14097",
        "name": "Xã Long Kiến",
        "type": "xa"
      },
      {
        "code": "20241",
        "name": "Xã Long Thạnh",
        "type": "xa"
      },
      {
        "code": "7697",
        "name": "Xã Mỹ Đức",
        "type": "xa"
      },
      {
        "code": "2577",
        "name": "Xã Mỹ Hòa Hưng",
        "type": "xa"
      },
      {
        "code": "17937",
        "name": "Xã Mỹ Thuận",
        "type": "xa"
      },
      {
        "code": "20753",
        "name": "Xã Ngọc Chúc",
        "type": "xa"
      },
      {
        "code": "2833",
        "name": "Xã Nhơn Hội",
        "type": "xa"
      },
      {
        "code": "13841",
        "name": "Xã Nhơn Mỹ",
        "type": "xa"
      },
      {
        "code": "10001",
        "name": "Xã Núi Cấm",
        "type": "xa"
      },
      {
        "code": "14609",
        "name": "Xã Óc Eo",
        "type": "xa"
      },
      {
        "code": "10769",
        "name": "Xã Ô Lâm",
        "type": "xa"
      },
      {
        "code": "6417",
        "name": "Xã Phú An",
        "type": "xa"
      },
      {
        "code": "15121",
        "name": "Xã Phú Hòa",
        "type": "xa"
      },
      {
        "code": "3089",
        "name": "Xã Phú Hữu",
        "type": "xa"
      },
      {
        "code": "7441",
        "name": "Xã Phú Lâm",
        "type": "xa"
      },
      {
        "code": "6161",
        "name": "Xã Phú Tân",
        "type": "xa"
      },
      {
        "code": "529",
        "name": "Xã Sơn Hải",
        "type": "xa"
      },
      {
        "code": "17681",
        "name": "Xã Sơn Kiên",
        "type": "xa"
      },
      {
        "code": "5393",
        "name": "Xã Tân An",
        "type": "xa"
      },
      {
        "code": "19217",
        "name": "Xã Tân Hiệp",
        "type": "xa"
      },
      {
        "code": "18961",
        "name": "Xã Tân Hội",
        "type": "xa"
      },
      {
        "code": "23313",
        "name": "Xã Tân Thạnh",
        "type": "xa"
      },
      {
        "code": "15633",
        "name": "Xã Tây Phú",
        "type": "xa"
      },
      {
        "code": "22289",
        "name": "Xã Tây Yên",
        "type": "xa"
      },
      {
        "code": "19473",
        "name": "Xã Thạnh Đông",
        "type": "xa"
      },
      {
        "code": "19985",
        "name": "Xã Thạnh Hưng",
        "type": "xa"
      },
      {
        "code": "18193",
        "name": "Xã Thạnh Lộc",
        "type": "xa"
      },
      {
        "code": "8721",
        "name": "Xã Thạnh Mỹ Tây",
        "type": "xa"
      },
      {
        "code": "14353",
        "name": "Xã Thoại Sơn",
        "type": "xa"
      },
      {
        "code": "3345",
        "name": "Xã Tiên Hải",
        "type": "xa"
      },
      {
        "code": "10513",
        "name": "Xã Tri Tôn",
        "type": "xa"
      },
      {
        "code": "24593",
        "name": "Xã U Minh Thượng",
        "type": "xa"
      },
      {
        "code": "24081",
        "name": "Xã Vân Khánh",
        "type": "xa"
      },
      {
        "code": "12561",
        "name": "Xã Vĩnh An",
        "type": "xa"
      },
      {
        "code": "24849",
        "name": "Xã Vĩnh Bình",
        "type": "xa"
      },
      {
        "code": "17169",
        "name": "Xã Vĩnh Điều",
        "type": "xa"
      },
      {
        "code": "11281",
        "name": "Xã Vĩnh Gia",
        "type": "xa"
      },
      {
        "code": "12305",
        "name": "Xã Vĩnh Hanh",
        "type": "xa"
      },
      {
        "code": "4369",
        "name": "Xã Vĩnh Hậu",
        "type": "xa"
      },
      {
        "code": "24337",
        "name": "Xã Vĩnh Hòa",
        "type": "xa"
      },
      {
        "code": "21777",
        "name": "Xã Vĩnh Hòa Hưng",
        "type": "xa"
      },
      {
        "code": "25361",
        "name": "Xã Vĩnh Phong",
        "type": "xa"
      },
      {
        "code": "7953",
        "name": "Xã Vĩnh Thạnh Trung",
        "type": "xa"
      },
      {
        "code": "25105",
        "name": "Xã Vĩnh Thuận",
        "type": "xa"
      },
      {
        "code": "15377",
        "name": "Xã Vĩnh Trạch",
        "type": "xa"
      },
      {
        "code": "22033",
        "name": "Xã Vĩnh Tuy",
        "type": "xa"
      },
      {
        "code": "5905",
        "name": "Xã Vĩnh Xương",
        "type": "xa"
      }
    ]
  },
  {
    "code": "18",
    "name": "Bắc Ninh",
    "wards": [
      {
        "code": "23826",
        "name": "Phường Bắc Giang",
        "type": "phuong"
      },
      {
        "code": "5906",
        "name": "Phường Bồng Lai",
        "type": "phuong"
      },
      {
        "code": "25362",
        "name": "Phường Cảnh Thụy",
        "type": "phuong"
      },
      {
        "code": "15378",
        "name": "Phường Chũ",
        "type": "phuong"
      },
      {
        "code": "24082",
        "name": "Phường Đa Mai",
        "type": "phuong"
      },
      {
        "code": "5650",
        "name": "Phường Đào Viên",
        "type": "phuong"
      },
      {
        "code": "2834",
        "name": "Phường Đồng Nguyên",
        "type": "phuong"
      },
      {
        "code": "1810",
        "name": "Phường Hạp Lĩnh",
        "type": "phuong"
      },
      {
        "code": "1042",
        "name": "Phường Kinh Bắc",
        "type": "phuong"
      },
      {
        "code": "3602",
        "name": "Phường Mão Điền",
        "type": "phuong"
      },
      {
        "code": "2066",
        "name": "Phường Nam Sơn",
        "type": "phuong"
      },
      {
        "code": "23058",
        "name": "Phường Nếnh",
        "type": "phuong"
      },
      {
        "code": "5394",
        "name": "Phường Nhân Hòa",
        "type": "phuong"
      },
      {
        "code": "4626",
        "name": "Phường Ninh Xá",
        "type": "phuong"
      },
      {
        "code": "3090",
        "name": "Phường Phù Khê",
        "type": "phuong"
      },
      {
        "code": "5138",
        "name": "Phường Phương Liễu",
        "type": "phuong"
      },
      {
        "code": "15634",
        "name": "Phường Phượng Sơn",
        "type": "phuong"
      },
      {
        "code": "4882",
        "name": "Phường Quế Võ",
        "type": "phuong"
      },
      {
        "code": "4370",
        "name": "Phường Song Liễu",
        "type": "phuong"
      },
      {
        "code": "2578",
        "name": "Phường Tam Sơn",
        "type": "phuong"
      },
      {
        "code": "24594",
        "name": "Phường Tân An",
        "type": "phuong"
      },
      {
        "code": "25106",
        "name": "Phường Tân Tiến",
        "type": "phuong"
      },
      {
        "code": "3346",
        "name": "Phường Thuận Thành",
        "type": "phuong"
      },
      {
        "code": "24338",
        "name": "Phường Tiền Phong",
        "type": "phuong"
      },
      {
        "code": "3858",
        "name": "Phường Trạm Lộ",
        "type": "phuong"
      },
      {
        "code": "4114",
        "name": "Phường Trí Quả",
        "type": "phuong"
      },
      {
        "code": "22546",
        "name": "Phường Tự Lạn",
        "type": "phuong"
      },
      {
        "code": "2322",
        "name": "Phường Từ Sơn",
        "type": "phuong"
      },
      {
        "code": "23314",
        "name": "Phường Vân Hà",
        "type": "phuong"
      },
      {
        "code": "22802",
        "name": "Phường Việt Yên",
        "type": "phuong"
      },
      {
        "code": "1298",
        "name": "Phường Võ Cường",
        "type": "phuong"
      },
      {
        "code": "1554",
        "name": "Phường Vũ Ninh",
        "type": "phuong"
      },
      {
        "code": "24850",
        "name": "Phường Yên Dũng",
        "type": "phuong"
      },
      {
        "code": "13074",
        "name": "Xã An Lạc",
        "type": "xa"
      },
      {
        "code": "17682",
        "name": "Xã Bảo Đài",
        "type": "xa"
      },
      {
        "code": "17426",
        "name": "Xã Bắc Lũng",
        "type": "xa"
      },
      {
        "code": "13586",
        "name": "Xã Biển Động",
        "type": "xa"
      },
      {
        "code": "530",
        "name": "Xã Biên Sơn",
        "type": "xa"
      },
      {
        "code": "19474",
        "name": "Xã Bố Hạ",
        "type": "xa"
      },
      {
        "code": "10002",
        "name": "Xã Cao Đức",
        "type": "xa"
      },
      {
        "code": "16402",
        "name": "Xã Cẩm Lý",
        "type": "xa"
      },
      {
        "code": "6162",
        "name": "Xã Chi Lăng",
        "type": "xa"
      },
      {
        "code": "12562",
        "name": "Xã Dương Hưu",
        "type": "xa"
      },
      {
        "code": "8722",
        "name": "Xã Đại Đồng",
        "type": "xa"
      },
      {
        "code": "9746",
        "name": "Xã Đại Lai",
        "type": "xa"
      },
      {
        "code": "11794",
        "name": "Xã Đại Sơn",
        "type": "xa"
      },
      {
        "code": "14098",
        "name": "Xã Đèo Gia",
        "type": "xa"
      },
      {
        "code": "10258",
        "name": "Xã Đông Cứu",
        "type": "xa"
      },
      {
        "code": "11538",
        "name": "Xã Đồng Kỳ",
        "type": "xa"
      },
      {
        "code": "16658",
        "name": "Xã Đông Phú",
        "type": "xa"
      },
      {
        "code": "23570",
        "name": "Xã Đồng Việt",
        "type": "xa"
      },
      {
        "code": "9234",
        "name": "Xã Gia Bình",
        "type": "xa"
      },
      {
        "code": "21778",
        "name": "Xã Hiệp Hòa",
        "type": "xa"
      },
      {
        "code": "22034",
        "name": "Xã Hoàng Vân",
        "type": "xa"
      },
      {
        "code": "21522",
        "name": "Xã Hợp Thịnh",
        "type": "xa"
      },
      {
        "code": "18450",
        "name": "Xã Kép",
        "type": "xa"
      },
      {
        "code": "15122",
        "name": "Xã Kiên Lao",
        "type": "xa"
      },
      {
        "code": "17938",
        "name": "Xã Lạng Giang",
        "type": "xa"
      },
      {
        "code": "10770",
        "name": "Xã Lâm Thao",
        "type": "xa"
      },
      {
        "code": "8210",
        "name": "Xã Liên Bão",
        "type": "xa"
      },
      {
        "code": "17170",
        "name": "Xã Lục Nam",
        "type": "xa"
      },
      {
        "code": "13842",
        "name": "Xã Lục Ngạn",
        "type": "xa"
      },
      {
        "code": "15890",
        "name": "Xã Lục Sơn",
        "type": "xa"
      },
      {
        "code": "10514",
        "name": "Xã Lương Tài",
        "type": "xa"
      },
      {
        "code": "18194",
        "name": "Xã Mỹ Thái",
        "type": "xa"
      },
      {
        "code": "14866",
        "name": "Xã Nam Dương",
        "type": "xa"
      },
      {
        "code": "16914",
        "name": "Xã Nghĩa Phương",
        "type": "xa"
      },
      {
        "code": "20498",
        "name": "Xã Ngọc Thiện",
        "type": "xa"
      },
      {
        "code": "20754",
        "name": "Xã Nhã Nam",
        "type": "xa"
      },
      {
        "code": "9490",
        "name": "Xã Nhân Thắng",
        "type": "xa"
      },
      {
        "code": "8978",
        "name": "Xã Phật Tích",
        "type": "xa"
      },
      {
        "code": "6418",
        "name": "Xã Phù Lãng",
        "type": "xa"
      },
      {
        "code": "21010",
        "name": "Xã Phúc Hòa",
        "type": "xa"
      },
      {
        "code": "21266",
        "name": "Xã Quang Trung",
        "type": "xa"
      },
      {
        "code": "274",
        "name": "Xã Sa Lý",
        "type": "xa"
      },
      {
        "code": "12050",
        "name": "Xã Sơn Động",
        "type": "xa"
      },
      {
        "code": "14354",
        "name": "Xã Sơn Hải",
        "type": "xa"
      },
      {
        "code": "7698",
        "name": "Xã Tam Đa",
        "type": "xa"
      },
      {
        "code": "7186",
        "name": "Xã Tam Giang",
        "type": "xa"
      },
      {
        "code": "19986",
        "name": "Xã Tam Tiến",
        "type": "xa"
      },
      {
        "code": "8466",
        "name": "Xã Tân Chi",
        "type": "xa"
      },
      {
        "code": "18706",
        "name": "Xã Tân Dĩnh",
        "type": "xa"
      },
      {
        "code": "14610",
        "name": "Xã Tân Sơn",
        "type": "xa"
      },
      {
        "code": "20242",
        "name": "Xã Tân Yên",
        "type": "xa"
      },
      {
        "code": "12306",
        "name": "Xã Tây Yên Tử",
        "type": "xa"
      },
      {
        "code": "7954",
        "name": "Xã Tiên Du",
        "type": "xa"
      },
      {
        "code": "18962",
        "name": "Xã Tiên Lục",
        "type": "xa"
      },
      {
        "code": "11026",
        "name": "Xã Trung Chính",
        "type": "xa"
      },
      {
        "code": "11282",
        "name": "Xã Trung Kênh",
        "type": "xa"
      },
      {
        "code": "16146",
        "name": "Xã Trường Sơn",
        "type": "xa"
      },
      {
        "code": "786",
        "name": "Xã Tuấn Đạo",
        "type": "xa"
      },
      {
        "code": "6930",
        "name": "Xã Văn Môn",
        "type": "xa"
      },
      {
        "code": "13330",
        "name": "Xã Vân Sơn",
        "type": "xa"
      },
      {
        "code": "22290",
        "name": "Xã Xuân Cẩm",
        "type": "xa"
      },
      {
        "code": "19730",
        "name": "Xã Xuân Lương",
        "type": "xa"
      },
      {
        "code": "12818",
        "name": "Xã Yên Định",
        "type": "xa"
      },
      {
        "code": "6674",
        "name": "Xã Yên Phong",
        "type": "xa"
      },
      {
        "code": "19218",
        "name": "Xã Yên Thế",
        "type": "xa"
      },
      {
        "code": "7442",
        "name": "Xã Yên Trung",
        "type": "xa"
      }
    ]
  },
  {
    "code": "19",
    "name": "Cà Mau",
    "wards": [
      {
        "code": "12307",
        "name": "Phường An Xuyên",
        "type": "phuong"
      },
      {
        "code": "5907",
        "name": "Phường Bạc Liêu",
        "type": "phuong"
      },
      {
        "code": "6675",
        "name": "Phường Giá Rai",
        "type": "phuong"
      },
      {
        "code": "6419",
        "name": "Phường Hiệp Thành",
        "type": "phuong"
      },
      {
        "code": "5139",
        "name": "Phường Hòa Thành",
        "type": "phuong"
      },
      {
        "code": "6931",
        "name": "Phường Láng Tròn",
        "type": "phuong"
      },
      {
        "code": "4883",
        "name": "Phường Lý Văn Lâm",
        "type": "phuong"
      },
      {
        "code": "5395",
        "name": "Phường Tân Thành",
        "type": "phuong"
      },
      {
        "code": "6163",
        "name": "Phường Vĩnh Trạch",
        "type": "phuong"
      },
      {
        "code": "8979",
        "name": "Xã An Trạch",
        "type": "xa"
      },
      {
        "code": "15379",
        "name": "Xã Biển Bạch",
        "type": "xa"
      },
      {
        "code": "15891",
        "name": "Xã Cái Đôi Vàm",
        "type": "xa"
      },
      {
        "code": "2579",
        "name": "Xã Cái Nước",
        "type": "xa"
      },
      {
        "code": "12051",
        "name": "Xã Châu Thới",
        "type": "xa"
      },
      {
        "code": "5651",
        "name": "Xã Đá Bạc",
        "type": "xa"
      },
      {
        "code": "2323",
        "name": "Xã Đầm Dơi",
        "type": "xa"
      },
      {
        "code": "1811",
        "name": "Xã Đất Mới",
        "type": "xa"
      },
      {
        "code": "1299",
        "name": "Xã Đất Mũi",
        "type": "xa"
      },
      {
        "code": "8723",
        "name": "Xã Định Thành",
        "type": "xa"
      },
      {
        "code": "9491",
        "name": "Xã Đông Hải",
        "type": "xa"
      },
      {
        "code": "8467",
        "name": "Xã Gành Hào",
        "type": "xa"
      },
      {
        "code": "9747",
        "name": "Xã Hòa Bình",
        "type": "xa"
      },
      {
        "code": "3603",
        "name": "Xã Hồ Thị Kỷ",
        "type": "xa"
      },
      {
        "code": "7443",
        "name": "Xã Hồng Dân",
        "type": "xa"
      },
      {
        "code": "11795",
        "name": "Xã Hưng Hội",
        "type": "xa"
      },
      {
        "code": "2835",
        "name": "Xã Hưng Mỹ",
        "type": "xa"
      },
      {
        "code": "4371",
        "name": "Xã Khánh An",
        "type": "xa"
      },
      {
        "code": "14099",
        "name": "Xã Khánh Bình",
        "type": "xa"
      },
      {
        "code": "14355",
        "name": "Xã Khánh Hưng",
        "type": "xa"
      },
      {
        "code": "4627",
        "name": "Xã Khánh Lâm",
        "type": "xa"
      },
      {
        "code": "9235",
        "name": "Xã Long Điền",
        "type": "xa"
      },
      {
        "code": "3091",
        "name": "Xã Lương Thế Trân",
        "type": "xa"
      },
      {
        "code": "2067",
        "name": "Xã Năm Căn",
        "type": "xa"
      },
      {
        "code": "4115",
        "name": "Xã Nguyễn Phích",
        "type": "xa"
      },
      {
        "code": "16147",
        "name": "Xã Nguyễn Việt Khái",
        "type": "xa"
      },
      {
        "code": "8211",
        "name": "Xã Ninh Quới",
        "type": "xa"
      },
      {
        "code": "7955",
        "name": "Xã Ninh Thạnh Lợi",
        "type": "xa"
      },
      {
        "code": "1043",
        "name": "Xã Phan Ngọc Hiển",
        "type": "xa"
      },
      {
        "code": "11027",
        "name": "Xã Phong Hiệp",
        "type": "xa"
      },
      {
        "code": "7187",
        "name": "Xã Phong Thạnh",
        "type": "xa"
      },
      {
        "code": "3347",
        "name": "Xã Phú Mỹ",
        "type": "xa"
      },
      {
        "code": "16403",
        "name": "Xã Phú Tân",
        "type": "xa"
      },
      {
        "code": "10515",
        "name": "Xã Phước Long",
        "type": "xa"
      },
      {
        "code": "13587",
        "name": "Xã Quách Phẩm",
        "type": "xa"
      },
      {
        "code": "1555",
        "name": "Xã Sông Đốc",
        "type": "xa"
      },
      {
        "code": "787",
        "name": "Xã Tạ An Khương",
        "type": "xa"
      },
      {
        "code": "15635",
        "name": "Xã Tam Giang",
        "type": "xa"
      },
      {
        "code": "13843",
        "name": "Xã Tân Ân",
        "type": "xa"
      },
      {
        "code": "531",
        "name": "Xã Tân Hưng",
        "type": "xa"
      },
      {
        "code": "15123",
        "name": "Xã Tân Lộc",
        "type": "xa"
      },
      {
        "code": "12563",
        "name": "Xã Tân Thuận",
        "type": "xa"
      },
      {
        "code": "12819",
        "name": "Xã Tân Tiến",
        "type": "xa"
      },
      {
        "code": "13331",
        "name": "Xã Thanh Tùng",
        "type": "xa"
      },
      {
        "code": "14611",
        "name": "Xã Thới Bình",
        "type": "xa"
      },
      {
        "code": "13075",
        "name": "Xã Trần Phán",
        "type": "xa"
      },
      {
        "code": "3859",
        "name": "Xã Trần Văn Thời",
        "type": "xa"
      },
      {
        "code": "14867",
        "name": "Xã Trí Phải",
        "type": "xa"
      },
      {
        "code": "275",
        "name": "Xã U Minh",
        "type": "xa"
      },
      {
        "code": "10259",
        "name": "Xã Vĩnh Hậu",
        "type": "xa"
      },
      {
        "code": "7699",
        "name": "Xã Vĩnh Lộc",
        "type": "xa"
      },
      {
        "code": "11539",
        "name": "Xã Vĩnh Lợi",
        "type": "xa"
      },
      {
        "code": "10003",
        "name": "Xã Vĩnh Mỹ",
        "type": "xa"
      },
      {
        "code": "10771",
        "name": "Xã Vĩnh Phước",
        "type": "xa"
      },
      {
        "code": "11283",
        "name": "Xã Vĩnh Thanh",
        "type": "xa"
      }
    ]
  },
  {
    "code": "20",
    "name": "Cao Bằng",
    "wards": [
      {
        "code": "788",
        "name": "Phường Nùng Trí Cao",
        "type": "phuong"
      },
      {
        "code": "532",
        "name": "Phường Tân Giang",
        "type": "phuong"
      },
      {
        "code": "276",
        "name": "Phường Thục Phán",
        "type": "phuong"
      },
      {
        "code": "7444",
        "name": "Xã Bạch Đằng",
        "type": "xa"
      },
      {
        "code": "1556",
        "name": "Xã Bảo Lạc",
        "type": "xa"
      },
      {
        "code": "3860",
        "name": "Xã Bảo Lâm",
        "type": "xa"
      },
      {
        "code": "10004",
        "name": "Xã Bế Văn Đàn",
        "type": "xa"
      },
      {
        "code": "7956",
        "name": "Xã Ca Thành",
        "type": "xa"
      },
      {
        "code": "11284",
        "name": "Xã Canh Tân",
        "type": "xa"
      },
      {
        "code": "5396",
        "name": "Xã Cần Yên",
        "type": "xa"
      },
      {
        "code": "2068",
        "name": "Xã Cô Ba",
        "type": "xa"
      },
      {
        "code": "1812",
        "name": "Xã Cốc Pàng",
        "type": "xa"
      },
      {
        "code": "13844",
        "name": "Xã Đàm Thủy",
        "type": "xa"
      },
      {
        "code": "14356",
        "name": "Xã Đình Phong",
        "type": "xa"
      },
      {
        "code": "13332",
        "name": "Xã Đoài Dương",
        "type": "xa"
      },
      {
        "code": "10260",
        "name": "Xã Độc Lập",
        "type": "xa"
      },
      {
        "code": "12052",
        "name": "Xã Đông Khê",
        "type": "xa"
      },
      {
        "code": "12308",
        "name": "Xã Đức Long",
        "type": "xa"
      },
      {
        "code": "4372",
        "name": "Xã Hạ Lang",
        "type": "xa"
      },
      {
        "code": "6164",
        "name": "Xã Hà Quảng",
        "type": "xa"
      },
      {
        "code": "10772",
        "name": "Xã Hạnh Phúc",
        "type": "xa"
      },
      {
        "code": "7188",
        "name": "Xã Hòa An",
        "type": "xa"
      },
      {
        "code": "2836",
        "name": "Xã Huy Giáp",
        "type": "xa"
      },
      {
        "code": "1300",
        "name": "Xã Hưng Đạo",
        "type": "xa"
      },
      {
        "code": "2324",
        "name": "Xã Khánh Xuân",
        "type": "xa"
      },
      {
        "code": "11540",
        "name": "Xã Kim Đồng",
        "type": "xa"
      },
      {
        "code": "6420",
        "name": "Xã Lũng Nặm",
        "type": "xa"
      },
      {
        "code": "3604",
        "name": "Xã Lý Bôn",
        "type": "xa"
      },
      {
        "code": "4628",
        "name": "Xã Lý Quốc",
        "type": "xa"
      },
      {
        "code": "11028",
        "name": "Xã Minh Khai",
        "type": "xa"
      },
      {
        "code": "9492",
        "name": "Xã Minh Tâm",
        "type": "xa"
      },
      {
        "code": "3348",
        "name": "Xã Nam Quang",
        "type": "xa"
      },
      {
        "code": "6932",
        "name": "Xã Nam Tuấn",
        "type": "xa"
      },
      {
        "code": "8980",
        "name": "Xã Nguyên Bình",
        "type": "xa"
      },
      {
        "code": "7700",
        "name": "Xã Nguyễn Huệ",
        "type": "xa"
      },
      {
        "code": "8212",
        "name": "Xã Phan Thanh",
        "type": "xa"
      },
      {
        "code": "9748",
        "name": "Xã Phục Hòa",
        "type": "xa"
      },
      {
        "code": "12564",
        "name": "Xã Quang Hán",
        "type": "xa"
      },
      {
        "code": "3092",
        "name": "Xã Quảng Lâm",
        "type": "xa"
      },
      {
        "code": "14100",
        "name": "Xã Quang Long",
        "type": "xa"
      },
      {
        "code": "13076",
        "name": "Xã Quang Trung",
        "type": "xa"
      },
      {
        "code": "10516",
        "name": "Xã Quảng Uyên",
        "type": "xa"
      },
      {
        "code": "1044",
        "name": "Xã Sơn Lộ",
        "type": "xa"
      },
      {
        "code": "8724",
        "name": "Xã Tam Kim",
        "type": "xa"
      },
      {
        "code": "11796",
        "name": "Xã Thạch An",
        "type": "xa"
      },
      {
        "code": "8468",
        "name": "Xã Thành Công",
        "type": "xa"
      },
      {
        "code": "5140",
        "name": "Xã Thanh Long",
        "type": "xa"
      },
      {
        "code": "5652",
        "name": "Xã Thông Nông",
        "type": "xa"
      },
      {
        "code": "9236",
        "name": "Xã Tĩnh Túc",
        "type": "xa"
      },
      {
        "code": "6676",
        "name": "Xã Tổng Cọt",
        "type": "xa"
      },
      {
        "code": "12820",
        "name": "Xã Trà Lĩnh",
        "type": "xa"
      },
      {
        "code": "13588",
        "name": "Xã Trùng Khánh",
        "type": "xa"
      },
      {
        "code": "5908",
        "name": "Xã Trường Hà",
        "type": "xa"
      },
      {
        "code": "4884",
        "name": "Xã Vinh Quý",
        "type": "xa"
      },
      {
        "code": "2580",
        "name": "Xã Xuân Trường",
        "type": "xa"
      },
      {
        "code": "4116",
        "name": "Xã Yên Thổ",
        "type": "xa"
      }
    ]
  },
  {
    "code": "21",
    "name": "Đắk Lắk",
    "wards": [
      {
        "code": "533",
        "name": "Phường Bình Kiến",
        "type": "phuong"
      },
      {
        "code": "6165",
        "name": "Phường Buôn Hồ",
        "type": "phuong"
      },
      {
        "code": "4629",
        "name": "Phường Buôn Ma Thuột",
        "type": "phuong"
      },
      {
        "code": "6421",
        "name": "Phường Cư Bao",
        "type": "phuong"
      },
      {
        "code": "20501",
        "name": "Phường Đông Hòa",
        "type": "phuong"
      },
      {
        "code": "5653",
        "name": "Phường Ea Kao",
        "type": "phuong"
      },
      {
        "code": "277",
        "name": "Phường Hòa Hiệp",
        "type": "phuong"
      },
      {
        "code": "1813",
        "name": "Phường Phú Yên",
        "type": "phuong"
      },
      {
        "code": "24853",
        "name": "Phường Sông Cầu",
        "type": "phuong"
      },
      {
        "code": "4885",
        "name": "Phường Tân An",
        "type": "phuong"
      },
      {
        "code": "5141",
        "name": "Phường Tân Lập",
        "type": "phuong"
      },
      {
        "code": "5397",
        "name": "Phường Thành Nhất",
        "type": "phuong"
      },
      {
        "code": "25365",
        "name": "Phường Tuy Hòa",
        "type": "phuong"
      },
      {
        "code": "2069",
        "name": "Phường Xuân Đài",
        "type": "phuong"
      },
      {
        "code": "2581",
        "name": "Xã Buôn Đôn",
        "type": "xa"
      },
      {
        "code": "8981",
        "name": "Xã Cuôr Đăng",
        "type": "xa"
      },
      {
        "code": "9237",
        "name": "Xã Cư M'gar",
        "type": "xa"
      },
      {
        "code": "15637",
        "name": "Xã Cư M'ta",
        "type": "xa"
      },
      {
        "code": "10261",
        "name": "Xã Cư Pơng",
        "type": "xa"
      },
      {
        "code": "16149",
        "name": "Xã Cư Prao",
        "type": "xa"
      },
      {
        "code": "17429",
        "name": "Xã Cư Pui",
        "type": "xa"
      },
      {
        "code": "14613",
        "name": "Xã Cư Yang",
        "type": "xa"
      },
      {
        "code": "16661",
        "name": "Xã Dang Kang",
        "type": "xa"
      },
      {
        "code": "11797",
        "name": "Xã Dliê Ya",
        "type": "xa"
      },
      {
        "code": "2325",
        "name": "Xã Dray Bhăng",
        "type": "xa"
      },
      {
        "code": "19221",
        "name": "Xã Dur Kmăl",
        "type": "xa"
      },
      {
        "code": "17941",
        "name": "Xã Đắk Liêng",
        "type": "xa"
      },
      {
        "code": "18453",
        "name": "Xã Đắk Phơi",
        "type": "xa"
      },
      {
        "code": "24597",
        "name": "Xã Đồng Xuân",
        "type": "xa"
      },
      {
        "code": "1045",
        "name": "Xã Đức Bình",
        "type": "xa"
      },
      {
        "code": "1301",
        "name": "Xã Ea Bá",
        "type": "xa"
      },
      {
        "code": "7445",
        "name": "Xã Ea Bung",
        "type": "xa"
      },
      {
        "code": "10773",
        "name": "Xã Ea Drăng",
        "type": "xa"
      },
      {
        "code": "6677",
        "name": "Xã Ea Drông",
        "type": "xa"
      },
      {
        "code": "3861",
        "name": "Xã Ea H'Leo",
        "type": "xa"
      },
      {
        "code": "11285",
        "name": "Xã Ea Hiao",
        "type": "xa"
      },
      {
        "code": "13845",
        "name": "Xã Ea Kar",
        "type": "xa"
      },
      {
        "code": "10517",
        "name": "Xã Ea Khăl",
        "type": "xa"
      },
      {
        "code": "8213",
        "name": "Xã Ea Kiết",
        "type": "xa"
      },
      {
        "code": "13589",
        "name": "Xã Ea Kly",
        "type": "xa"
      },
      {
        "code": "14357",
        "name": "Xã Ea Knốp",
        "type": "xa"
      },
      {
        "code": "12821",
        "name": "Xã Ea Knuếc",
        "type": "xa"
      },
      {
        "code": "2837",
        "name": "Xã Ea KTur",
        "type": "xa"
      },
      {
        "code": "1557",
        "name": "Xã Ea Ly",
        "type": "xa"
      },
      {
        "code": "8469",
        "name": "Xã Ea M'Droh",
        "type": "xa"
      },
      {
        "code": "19477",
        "name": "Xã Ea Na",
        "type": "xa"
      },
      {
        "code": "18709",
        "name": "Xã Ea Ning",
        "type": "xa"
      },
      {
        "code": "7957",
        "name": "Xã Ea Nuôl",
        "type": "xa"
      },
      {
        "code": "14101",
        "name": "Xã Ea Ô",
        "type": "xa"
      },
      {
        "code": "14869",
        "name": "Xã Ea Păl",
        "type": "xa"
      },
      {
        "code": "13333",
        "name": "Xã Ea Phê",
        "type": "xa"
      },
      {
        "code": "15381",
        "name": "Xã Ea Riêng",
        "type": "xa"
      },
      {
        "code": "7189",
        "name": "Xã Ea Rốk",
        "type": "xa"
      },
      {
        "code": "6933",
        "name": "Xã Ea Súp",
        "type": "xa"
      },
      {
        "code": "3605",
        "name": "Xã Ea Trang",
        "type": "xa"
      },
      {
        "code": "9493",
        "name": "Xã Ea Tul",
        "type": "xa"
      },
      {
        "code": "7701",
        "name": "Xã Ea Wer",
        "type": "xa"
      },
      {
        "code": "11029",
        "name": "Xã Ea Wy",
        "type": "xa"
      },
      {
        "code": "22549",
        "name": "Xã Hòa Mỹ",
        "type": "xa"
      },
      {
        "code": "5909",
        "name": "Xã Hòa Phú",
        "type": "xa"
      },
      {
        "code": "16405",
        "name": "Xã Hòa Sơn",
        "type": "xa"
      },
      {
        "code": "22293",
        "name": "Xã Hòa Thịnh",
        "type": "xa"
      },
      {
        "code": "20757",
        "name": "Xã Hòa Xuân",
        "type": "xa"
      },
      {
        "code": "4117",
        "name": "Xã Ia Lốp",
        "type": "xa"
      },
      {
        "code": "4373",
        "name": "Xã Ia Rvê",
        "type": "xa"
      },
      {
        "code": "15893",
        "name": "Xã Krông Á",
        "type": "xa"
      },
      {
        "code": "18965",
        "name": "Xã Krông Ana",
        "type": "xa"
      },
      {
        "code": "16917",
        "name": "Xã Krông Bông",
        "type": "xa"
      },
      {
        "code": "10005",
        "name": "Xã Krông Búk",
        "type": "xa"
      },
      {
        "code": "11541",
        "name": "Xã Krông Năng",
        "type": "xa"
      },
      {
        "code": "3349",
        "name": "Xã Krông Nô",
        "type": "xa"
      },
      {
        "code": "12565",
        "name": "Xã Krông Pắc",
        "type": "xa"
      },
      {
        "code": "17685",
        "name": "Xã Liên Sơn Lắk",
        "type": "xa"
      },
      {
        "code": "15125",
        "name": "Xã M'Drắk",
        "type": "xa"
      },
      {
        "code": "18197",
        "name": "Xã Nam Ka",
        "type": "xa"
      },
      {
        "code": "21525",
        "name": "Xã Ô Loan",
        "type": "xa"
      },
      {
        "code": "25621",
        "name": "Xã Phú Hòa 1",
        "type": "xa"
      },
      {
        "code": "789",
        "name": "Xã Phú Hòa 2",
        "type": "xa"
      },
      {
        "code": "24085",
        "name": "Xã Phú Mỡ",
        "type": "xa"
      },
      {
        "code": "12309",
        "name": "Xã Phú Xuân",
        "type": "xa"
      },
      {
        "code": "9749",
        "name": "Xã Pơng Drang",
        "type": "xa"
      },
      {
        "code": "8725",
        "name": "Xã Quảng Phú",
        "type": "xa"
      },
      {
        "code": "26133",
        "name": "Xã Sông Hinh",
        "type": "xa"
      },
      {
        "code": "23061",
        "name": "Xã Sơn Hòa",
        "type": "xa"
      },
      {
        "code": "22805",
        "name": "Xã Sơn Thành",
        "type": "xa"
      },
      {
        "code": "25109",
        "name": "Xã Suối Trai",
        "type": "xa"
      },
      {
        "code": "12053",
        "name": "Xã Tam Giang",
        "type": "xa"
      },
      {
        "code": "13077",
        "name": "Xã Tân Tiến",
        "type": "xa"
      },
      {
        "code": "25877",
        "name": "Xã Tây Hòa",
        "type": "xa"
      },
      {
        "code": "23573",
        "name": "Xã Tây Sơn",
        "type": "xa"
      },
      {
        "code": "21013",
        "name": "Xã Tuy An Bắc",
        "type": "xa"
      },
      {
        "code": "21269",
        "name": "Xã Tuy An Đông",
        "type": "xa"
      },
      {
        "code": "21781",
        "name": "Xã Tuy An Nam",
        "type": "xa"
      },
      {
        "code": "22037",
        "name": "Xã Tuy An Tây",
        "type": "xa"
      },
      {
        "code": "23317",
        "name": "Xã Vân Hòa",
        "type": "xa"
      },
      {
        "code": "3093",
        "name": "Xã Vụ Bổn",
        "type": "xa"
      },
      {
        "code": "19989",
        "name": "Xã Xuân Cảnh",
        "type": "xa"
      },
      {
        "code": "23829",
        "name": "Xã Xuân Lãnh",
        "type": "xa"
      },
      {
        "code": "20245",
        "name": "Xã Xuân Lộc",
        "type": "xa"
      },
      {
        "code": "24341",
        "name": "Xã Xuân Phước",
        "type": "xa"
      },
      {
        "code": "19733",
        "name": "Xã Xuân Thọ",
        "type": "xa"
      },
      {
        "code": "17173",
        "name": "Xã Yang Mao",
        "type": "xa"
      }
    ]
  },
  {
    "code": "22",
    "name": "Điện Biên",
    "wards": [
      {
        "code": "8214",
        "name": "Phường Điện Biên Phủ",
        "type": "phuong"
      },
      {
        "code": "2838",
        "name": "Phường Mường Lay",
        "type": "phuong"
      },
      {
        "code": "8470",
        "name": "Phường Mường Thanh",
        "type": "phuong"
      },
      {
        "code": "7446",
        "name": "Xã Búng Lao",
        "type": "xa"
      },
      {
        "code": "2326",
        "name": "Xã Chà Tở",
        "type": "xa"
      },
      {
        "code": "6678",
        "name": "Xã Chiềng Sinh",
        "type": "xa"
      },
      {
        "code": "6934",
        "name": "Xã Mường Ảng",
        "type": "xa"
      },
      {
        "code": "1814",
        "name": "Xã Mường Chà",
        "type": "xa"
      },
      {
        "code": "7702",
        "name": "Xã Mường Lạn",
        "type": "xa"
      },
      {
        "code": "11030",
        "name": "Xã Mường Luân",
        "type": "xa"
      },
      {
        "code": "6166",
        "name": "Xã Mường Mùn",
        "type": "xa"
      },
      {
        "code": "10006",
        "name": "Xã Mường Nhà",
        "type": "xa"
      },
      {
        "code": "278",
        "name": "Xã Mường Nhé",
        "type": "xa"
      },
      {
        "code": "7958",
        "name": "Xã Mường Phăng",
        "type": "xa"
      },
      {
        "code": "4118",
        "name": "Xã Mường Pồn",
        "type": "xa"
      },
      {
        "code": "790",
        "name": "Xã Mường Toong",
        "type": "xa"
      },
      {
        "code": "3350",
        "name": "Xã Mường Tùng",
        "type": "xa"
      },
      {
        "code": "2070",
        "name": "Xã Nà Bủng",
        "type": "xa"
      },
      {
        "code": "1558",
        "name": "Xã Nà Hỳ",
        "type": "xa"
      },
      {
        "code": "3094",
        "name": "Xã Na Sang",
        "type": "xa"
      },
      {
        "code": "10262",
        "name": "Xã Na Son",
        "type": "xa"
      },
      {
        "code": "7190",
        "name": "Xã Nà Tấu",
        "type": "xa"
      },
      {
        "code": "1046",
        "name": "Xã Nậm Kè",
        "type": "xa"
      },
      {
        "code": "3862",
        "name": "Xã Nậm Nèn",
        "type": "xa"
      },
      {
        "code": "9750",
        "name": "Xã Núa Ngam",
        "type": "xa"
      },
      {
        "code": "3606",
        "name": "Xã Pa Ham",
        "type": "xa"
      },
      {
        "code": "11542",
        "name": "Xã Phình Giàng",
        "type": "xa"
      },
      {
        "code": "10774",
        "name": "Xã Pu Nhi",
        "type": "xa"
      },
      {
        "code": "6422",
        "name": "Xã Pú Nhung",
        "type": "xa"
      },
      {
        "code": "5910",
        "name": "Xã Quài Tở",
        "type": "xa"
      },
      {
        "code": "1302",
        "name": "Xã Quảng Lâm",
        "type": "xa"
      },
      {
        "code": "9494",
        "name": "Xã Sam Mứn",
        "type": "xa"
      },
      {
        "code": "5398",
        "name": "Xã Sáng Nhè",
        "type": "xa"
      },
      {
        "code": "2582",
        "name": "Xã Si Pa Phìn",
        "type": "xa"
      },
      {
        "code": "4630",
        "name": "Xã Sín Chải",
        "type": "xa"
      },
      {
        "code": "534",
        "name": "Xã Sín Thầu",
        "type": "xa"
      },
      {
        "code": "4886",
        "name": "Xã Sính Phình",
        "type": "xa"
      },
      {
        "code": "8982",
        "name": "Xã Thanh An",
        "type": "xa"
      },
      {
        "code": "8726",
        "name": "Xã Thanh Nưa",
        "type": "xa"
      },
      {
        "code": "9238",
        "name": "Xã Thanh Yên",
        "type": "xa"
      },
      {
        "code": "11286",
        "name": "Xã Tìa Dình",
        "type": "xa"
      },
      {
        "code": "4374",
        "name": "Xã Tủa Chùa",
        "type": "xa"
      },
      {
        "code": "5142",
        "name": "Xã Tủa Thàng",
        "type": "xa"
      },
      {
        "code": "5654",
        "name": "Xã Tuần Giáo",
        "type": "xa"
      },
      {
        "code": "10518",
        "name": "Xã Xa Dung",
        "type": "xa"
      }
    ]
  },
  {
    "code": "23",
    "name": "Đồng Nai",
    "wards": [
      {
        "code": "19223",
        "name": "Phường An Lộc",
        "type": "phuong"
      },
      {
        "code": "10519",
        "name": "Phường Bảo Vinh",
        "type": "phuong"
      },
      {
        "code": "17687",
        "name": "Phường Biên Hòa",
        "type": "phuong"
      },
      {
        "code": "18967",
        "name": "Phường Bình Long",
        "type": "phuong"
      },
      {
        "code": "10263",
        "name": "Phường Bình Lộc",
        "type": "phuong"
      },
      {
        "code": "17175",
        "name": "Phường Bình Phước",
        "type": "phuong"
      },
      {
        "code": "19735",
        "name": "Phường Chơn Thành",
        "type": "phuong"
      },
      {
        "code": "17431",
        "name": "Phường Đồng Xoài",
        "type": "phuong"
      },
      {
        "code": "11287",
        "name": "Phường Hàng Gòn",
        "type": "phuong"
      },
      {
        "code": "16407",
        "name": "Phường Hố Nai",
        "type": "phuong"
      },
      {
        "code": "15895",
        "name": "Phường Long Bình",
        "type": "phuong"
      },
      {
        "code": "16663",
        "name": "Phường Long Hưng",
        "type": "phuong"
      },
      {
        "code": "11031",
        "name": "Phường Long Khánh",
        "type": "phuong"
      },
      {
        "code": "19479",
        "name": "Phường Minh Hưng",
        "type": "phuong"
      },
      {
        "code": "18455",
        "name": "Phường Phước Bình",
        "type": "phuong"
      },
      {
        "code": "18711",
        "name": "Phường Phước Long",
        "type": "phuong"
      },
      {
        "code": "1047",
        "name": "Phường Phước Tân",
        "type": "phuong"
      },
      {
        "code": "18199",
        "name": "Phường Tam Hiệp",
        "type": "phuong"
      },
      {
        "code": "1303",
        "name": "Phường Tam Phước",
        "type": "phuong"
      },
      {
        "code": "5911",
        "name": "Phường Tân Triều",
        "type": "phuong"
      },
      {
        "code": "16151",
        "name": "Phường Trảng Dài",
        "type": "phuong"
      },
      {
        "code": "17943",
        "name": "Phường Trấn Biên",
        "type": "phuong"
      },
      {
        "code": "10775",
        "name": "Phường Xuân Lập",
        "type": "phuong"
      },
      {
        "code": "7959",
        "name": "Xã An Phước",
        "type": "xa"
      },
      {
        "code": "8215",
        "name": "Xã An Viễn",
        "type": "xa"
      },
      {
        "code": "8983",
        "name": "Xã Bàu Hàm",
        "type": "xa"
      },
      {
        "code": "7447",
        "name": "Xã Bình An",
        "type": "xa"
      },
      {
        "code": "8471",
        "name": "Xã Bình Minh",
        "type": "xa"
      },
      {
        "code": "24087",
        "name": "Xã Bình Tân",
        "type": "xa"
      },
      {
        "code": "15639",
        "name": "Xã Bom Bo",
        "type": "xa"
      },
      {
        "code": "14871",
        "name": "Xã Bù Đăng",
        "type": "xa"
      },
      {
        "code": "2071",
        "name": "Xã Bù Gia Mập",
        "type": "xa"
      },
      {
        "code": "12055",
        "name": "Xã Cẩm Mỹ",
        "type": "xa"
      },
      {
        "code": "9495",
        "name": "Xã Dầu Giây",
        "type": "xa"
      },
      {
        "code": "23831",
        "name": "Xã Đa Kia",
        "type": "xa"
      },
      {
        "code": "16919",
        "name": "Xã Đại Phước",
        "type": "xa"
      },
      {
        "code": "279",
        "name": "Xã Đak Lua",
        "type": "xa"
      },
      {
        "code": "15383",
        "name": "Xã Đak Nhau",
        "type": "xa"
      },
      {
        "code": "1559",
        "name": "Xã Đăk Ơ",
        "type": "xa"
      },
      {
        "code": "3607",
        "name": "Xã Định Quán",
        "type": "xa"
      },
      {
        "code": "14103",
        "name": "Xã Đồng Phú",
        "type": "xa"
      },
      {
        "code": "13591",
        "name": "Xã Đồng Tâm",
        "type": "xa"
      },
      {
        "code": "9751",
        "name": "Xã Gia Kiệm",
        "type": "xa"
      },
      {
        "code": "23319",
        "name": "Xã Hưng Phước",
        "type": "xa"
      },
      {
        "code": "9239",
        "name": "Xã Hưng Thịnh",
        "type": "xa"
      },
      {
        "code": "3351",
        "name": "Xã La Ngà",
        "type": "xa"
      },
      {
        "code": "24343",
        "name": "Xã Long Hà",
        "type": "xa"
      },
      {
        "code": "7191",
        "name": "Xã Long Phước",
        "type": "xa"
      },
      {
        "code": "7703",
        "name": "Xã Long Thành",
        "type": "xa"
      },
      {
        "code": "21783",
        "name": "Xã Lộc Hưng",
        "type": "xa"
      },
      {
        "code": "21527",
        "name": "Xã Lộc Ninh",
        "type": "xa"
      },
      {
        "code": "22551",
        "name": "Xã Lộc Quang",
        "type": "xa"
      },
      {
        "code": "22039",
        "name": "Xã Lộc Tấn",
        "type": "xa"
      },
      {
        "code": "21271",
        "name": "Xã Lộc Thành",
        "type": "xa"
      },
      {
        "code": "22295",
        "name": "Xã Lộc Thạnh",
        "type": "xa"
      },
      {
        "code": "21015",
        "name": "Xã Minh Đức",
        "type": "xa"
      },
      {
        "code": "4631",
        "name": "Xã Nam Cát Tiên",
        "type": "xa"
      },
      {
        "code": "14615",
        "name": "Xã Nghĩa Trung",
        "type": "xa"
      },
      {
        "code": "19991",
        "name": "Xã Nha Bích",
        "type": "xa"
      },
      {
        "code": "6423",
        "name": "Xã Nhơn Trạch",
        "type": "xa"
      },
      {
        "code": "4119",
        "name": "Xã Phú Hòa",
        "type": "xa"
      },
      {
        "code": "5143",
        "name": "Xã Phú Lâm",
        "type": "xa"
      },
      {
        "code": "535",
        "name": "Xã Phú Lý",
        "type": "xa"
      },
      {
        "code": "23575",
        "name": "Xã Phú Nghĩa",
        "type": "xa"
      },
      {
        "code": "6167",
        "name": "Xã Phú Riềng",
        "type": "xa"
      },
      {
        "code": "13079",
        "name": "Xã Phú Trung",
        "type": "xa"
      },
      {
        "code": "3863",
        "name": "Xã Phú Vinh",
        "type": "xa"
      },
      {
        "code": "6679",
        "name": "Xã Phước An",
        "type": "xa"
      },
      {
        "code": "14359",
        "name": "Xã Phước Sơn",
        "type": "xa"
      },
      {
        "code": "6935",
        "name": "Xã Phước Thái",
        "type": "xa"
      },
      {
        "code": "12311",
        "name": "Xã Sông Ray",
        "type": "xa"
      },
      {
        "code": "4375",
        "name": "Xã Tà Lài",
        "type": "xa"
      },
      {
        "code": "5655",
        "name": "Xã Tân An",
        "type": "xa"
      },
      {
        "code": "20503",
        "name": "Xã Tân Hưng",
        "type": "xa"
      },
      {
        "code": "20759",
        "name": "Xã Tân Khai",
        "type": "xa"
      },
      {
        "code": "13847",
        "name": "Xã Tân Lợi",
        "type": "xa"
      },
      {
        "code": "4887",
        "name": "Xã Tân Phú",
        "type": "xa"
      },
      {
        "code": "20247",
        "name": "Xã Tân Quan",
        "type": "xa"
      },
      {
        "code": "22807",
        "name": "Xã Tân Tiến",
        "type": "xa"
      },
      {
        "code": "2327",
        "name": "Xã Thanh Sơn",
        "type": "xa"
      },
      {
        "code": "23063",
        "name": "Xã Thiện Hưng",
        "type": "xa"
      },
      {
        "code": "15127",
        "name": "Xã Thọ Sơn",
        "type": "xa"
      },
      {
        "code": "10007",
        "name": "Xã Thống Nhất",
        "type": "xa"
      },
      {
        "code": "13335",
        "name": "Xã Thuận Lợi",
        "type": "xa"
      },
      {
        "code": "8727",
        "name": "Xã Trảng Bom",
        "type": "xa"
      },
      {
        "code": "5399",
        "name": "Xã Trị An",
        "type": "xa"
      },
      {
        "code": "3095",
        "name": "Xã Xuân Bắc",
        "type": "xa"
      },
      {
        "code": "12567",
        "name": "Xã Xuân Định",
        "type": "xa"
      },
      {
        "code": "1815",
        "name": "Xã Xuân Đông",
        "type": "xa"
      },
      {
        "code": "11799",
        "name": "Xã Xuân Đường",
        "type": "xa"
      },
      {
        "code": "791",
        "name": "Xã Xuân Hòa",
        "type": "xa"
      },
      {
        "code": "2583",
        "name": "Xã Xuân Lộc",
        "type": "xa"
      },
      {
        "code": "12823",
        "name": "Xã Xuân Phú",
        "type": "xa"
      },
      {
        "code": "11543",
        "name": "Xã Xuân Quế",
        "type": "xa"
      },
      {
        "code": "2839",
        "name": "Xã Xuân Thành",
        "type": "xa"
      }
    ]
  },
  {
    "code": "24",
    "name": "Đồng Tháp",
    "wards": [
      {
        "code": "2840",
        "name": "Phường An Bình",
        "type": "phuong"
      },
      {
        "code": "25368",
        "name": "Phường Bình Xuân",
        "type": "phuong"
      },
      {
        "code": "15896",
        "name": "Phường Cai Lậy",
        "type": "phuong"
      },
      {
        "code": "8216",
        "name": "Phường Cao Lãnh",
        "type": "phuong"
      },
      {
        "code": "19736",
        "name": "Phường Đạo Thạnh",
        "type": "phuong"
      },
      {
        "code": "24856",
        "name": "Phường Gò Công",
        "type": "phuong"
      },
      {
        "code": "3096",
        "name": "Phường Hồng Ngự",
        "type": "phuong"
      },
      {
        "code": "25112",
        "name": "Phường Long Thuận",
        "type": "phuong"
      },
      {
        "code": "8472",
        "name": "Phường Mỹ Ngãi",
        "type": "phuong"
      },
      {
        "code": "19992",
        "name": "Phường Mỹ Phong",
        "type": "phuong"
      },
      {
        "code": "15384",
        "name": "Phường Mỹ Phước Tây",
        "type": "phuong"
      },
      {
        "code": "19480",
        "name": "Phường Mỹ Tho",
        "type": "phuong"
      },
      {
        "code": "8728",
        "name": "Phường Mỹ Trà",
        "type": "phuong"
      },
      {
        "code": "16152",
        "name": "Phường Nhị Quý",
        "type": "phuong"
      },
      {
        "code": "10520",
        "name": "Phường Sa Đéc",
        "type": "phuong"
      },
      {
        "code": "25624",
        "name": "Phường Sơn Qui",
        "type": "phuong"
      },
      {
        "code": "15640",
        "name": "Phường Thanh Hòa",
        "type": "phuong"
      },
      {
        "code": "20248",
        "name": "Phường Thới Sơn",
        "type": "phuong"
      },
      {
        "code": "3352",
        "name": "Phường Thường Lạc",
        "type": "phuong"
      },
      {
        "code": "20504",
        "name": "Phường Trung An",
        "type": "phuong"
      },
      {
        "code": "4120",
        "name": "Xã An Hòa",
        "type": "xa"
      },
      {
        "code": "12056",
        "name": "Xã An Hữu",
        "type": "xa"
      },
      {
        "code": "5144",
        "name": "Xã An Long",
        "type": "xa"
      },
      {
        "code": "2584",
        "name": "Xã An Phước",
        "type": "xa"
      },
      {
        "code": "21784",
        "name": "Xã An Thạnh Thủy",
        "type": "xa"
      },
      {
        "code": "7192",
        "name": "Xã Ba Sao",
        "type": "xa"
      },
      {
        "code": "7704",
        "name": "Xã Bình Hàng Trung",
        "type": "xa"
      },
      {
        "code": "22040",
        "name": "Xã Bình Ninh",
        "type": "xa"
      },
      {
        "code": "14104",
        "name": "Xã Bình Phú",
        "type": "xa"
      },
      {
        "code": "5400",
        "name": "Xã Bình Thành",
        "type": "xa"
      },
      {
        "code": "19224",
        "name": "Xã Bình Trưng",
        "type": "xa"
      },
      {
        "code": "13592",
        "name": "Xã Cái Bè",
        "type": "xa"
      },
      {
        "code": "17944",
        "name": "Xã Châu Thành",
        "type": "xa"
      },
      {
        "code": "21528",
        "name": "Xã Chợ Gạo",
        "type": "xa"
      },
      {
        "code": "6424",
        "name": "Xã Đốc Binh Kiều",
        "type": "xa"
      },
      {
        "code": "23832",
        "name": "Xã Đồng Sơn",
        "type": "xa"
      },
      {
        "code": "23320",
        "name": "Xã Gia Thuận",
        "type": "xa"
      },
      {
        "code": "22296",
        "name": "Xã Gò Công Đông",
        "type": "xa"
      },
      {
        "code": "13080",
        "name": "Xã Hậu Mỹ",
        "type": "xa"
      },
      {
        "code": "13848",
        "name": "Xã Hiệp Đức",
        "type": "xa"
      },
      {
        "code": "10008",
        "name": "Xã Hòa Long",
        "type": "xa"
      },
      {
        "code": "13336",
        "name": "Xã Hội Cư",
        "type": "xa"
      },
      {
        "code": "17432",
        "name": "Xã Hưng Thạnh",
        "type": "xa"
      },
      {
        "code": "18968",
        "name": "Xã Kim Sơn",
        "type": "xa"
      },
      {
        "code": "9752",
        "name": "Xã Lai Vung",
        "type": "xa"
      },
      {
        "code": "9496",
        "name": "Xã Lấp Vò",
        "type": "xa"
      },
      {
        "code": "24344",
        "name": "Xã Long Bình",
        "type": "xa"
      },
      {
        "code": "18456",
        "name": "Xã Long Định",
        "type": "xa"
      },
      {
        "code": "18200",
        "name": "Xã Long Hưng",
        "type": "xa"
      },
      {
        "code": "3864",
        "name": "Xã Long Khánh",
        "type": "xa"
      },
      {
        "code": "1304",
        "name": "Xã Long Phú Thuận",
        "type": "xa"
      },
      {
        "code": "14616",
        "name": "Xã Long Tiên",
        "type": "xa"
      },
      {
        "code": "21016",
        "name": "Xã Lương Hòa Lạc",
        "type": "xa"
      },
      {
        "code": "8984",
        "name": "Xã Mỹ An Hưng",
        "type": "xa"
      },
      {
        "code": "12568",
        "name": "Xã Mỹ Đức Tây",
        "type": "xa"
      },
      {
        "code": "7960",
        "name": "Xã Mỹ Hiệp",
        "type": "xa"
      },
      {
        "code": "12312",
        "name": "Xã Mỹ Lợi",
        "type": "xa"
      },
      {
        "code": "6168",
        "name": "Xã Mỹ Quí",
        "type": "xa"
      },
      {
        "code": "14872",
        "name": "Xã Mỹ Thành",
        "type": "xa"
      },
      {
        "code": "12824",
        "name": "Xã Mỹ Thiện",
        "type": "xa"
      },
      {
        "code": "7448",
        "name": "Xã Mỹ Thọ",
        "type": "xa"
      },
      {
        "code": "20760",
        "name": "Xã Mỹ Tịnh An",
        "type": "xa"
      },
      {
        "code": "14360",
        "name": "Xã Ngũ Hiệp",
        "type": "xa"
      },
      {
        "code": "10264",
        "name": "Xã Phong Hòa",
        "type": "xa"
      },
      {
        "code": "280",
        "name": "Xã Phong Mỹ",
        "type": "xa"
      },
      {
        "code": "1560",
        "name": "Xã Phú Cường",
        "type": "xa"
      },
      {
        "code": "11032",
        "name": "Xã Phú Hựu",
        "type": "xa"
      },
      {
        "code": "24088",
        "name": "Xã Phú Thành",
        "type": "xa"
      },
      {
        "code": "4632",
        "name": "Xã Phú Thọ",
        "type": "xa"
      },
      {
        "code": "6936",
        "name": "Xã Phương Thịnh",
        "type": "xa"
      },
      {
        "code": "4376",
        "name": "Xã Tam Nông",
        "type": "xa"
      },
      {
        "code": "10776",
        "name": "Xã Tân Dương",
        "type": "xa"
      },
      {
        "code": "22552",
        "name": "Xã Tân Điền",
        "type": "xa"
      },
      {
        "code": "23064",
        "name": "Xã Tân Đông",
        "type": "xa"
      },
      {
        "code": "22808",
        "name": "Xã Tân Hòa",
        "type": "xa"
      },
      {
        "code": "2328",
        "name": "Xã Tân Hộ Cơ",
        "type": "xa"
      },
      {
        "code": "1816",
        "name": "Xã Tân Hồng",
        "type": "xa"
      },
      {
        "code": "17688",
        "name": "Xã Tân Hương",
        "type": "xa"
      },
      {
        "code": "9240",
        "name": "Xã Tân Khánh Trung",
        "type": "xa"
      },
      {
        "code": "536",
        "name": "Xã Tân Long",
        "type": "xa"
      },
      {
        "code": "11288",
        "name": "Xã Tân Nhuận Đông",
        "type": "xa"
      },
      {
        "code": "16408",
        "name": "Xã Tân Phú",
        "type": "xa"
      },
      {
        "code": "26136",
        "name": "Xã Tân Phú Đông",
        "type": "xa"
      },
      {
        "code": "11544",
        "name": "Xã Tân Phú Trung",
        "type": "xa"
      },
      {
        "code": "16664",
        "name": "Xã Tân Phước 1",
        "type": "xa"
      },
      {
        "code": "16920",
        "name": "Xã Tân Phước 2",
        "type": "xa"
      },
      {
        "code": "17176",
        "name": "Xã Tân Phước 3",
        "type": "xa"
      },
      {
        "code": "2072",
        "name": "Xã Tân Thành",
        "type": "xa"
      },
      {
        "code": "1048",
        "name": "Xã Tân Thạnh",
        "type": "xa"
      },
      {
        "code": "25880",
        "name": "Xã Tân Thới",
        "type": "xa"
      },
      {
        "code": "21272",
        "name": "Xã Tân Thuận Bình",
        "type": "xa"
      },
      {
        "code": "792",
        "name": "Xã Thanh Bình",
        "type": "xa"
      },
      {
        "code": "11800",
        "name": "Xã Thanh Hưng",
        "type": "xa"
      },
      {
        "code": "5912",
        "name": "Xã Thanh Mỹ",
        "type": "xa"
      },
      {
        "code": "15128",
        "name": "Xã Thạnh Phú",
        "type": "xa"
      },
      {
        "code": "5656",
        "name": "Xã Tháp Mười",
        "type": "xa"
      },
      {
        "code": "3608",
        "name": "Xã Thường Phước",
        "type": "xa"
      },
      {
        "code": "4888",
        "name": "Xã Tràm Chim",
        "type": "xa"
      },
      {
        "code": "6680",
        "name": "Xã Trường Xuân",
        "type": "xa"
      },
      {
        "code": "23576",
        "name": "Xã Vĩnh Bình",
        "type": "xa"
      },
      {
        "code": "24600",
        "name": "Xã Vĩnh Hựu",
        "type": "xa"
      },
      {
        "code": "18712",
        "name": "Xã Vĩnh Kim",
        "type": "xa"
      }
    ]
  },
  {
    "code": "25",
    "name": "Gia Lai",
    "wards": [
      {
        "code": "11033",
        "name": "Phường An Bình",
        "type": "phuong"
      },
      {
        "code": "10777",
        "name": "Phường An Khê",
        "type": "phuong"
      },
      {
        "code": "24601",
        "name": "Phường An Nhơn",
        "type": "phuong"
      },
      {
        "code": "25625",
        "name": "Phường An Nhơn Bắc",
        "type": "phuong"
      },
      {
        "code": "24857",
        "name": "Phường An Nhơn Đông",
        "type": "phuong"
      },
      {
        "code": "25369",
        "name": "Phường An Nhơn Nam",
        "type": "phuong"
      },
      {
        "code": "5657",
        "name": "Phường An Phú",
        "type": "phuong"
      },
      {
        "code": "14873",
        "name": "Phường Ayun Pa",
        "type": "phuong"
      },
      {
        "code": "24345",
        "name": "Phường Bình Định",
        "type": "phuong"
      },
      {
        "code": "25881",
        "name": "Phường Bồng Sơn",
        "type": "phuong"
      },
      {
        "code": "5401",
        "name": "Phường Diên Hồng",
        "type": "phuong"
      },
      {
        "code": "26137",
        "name": "Phường Hoài Nhơn",
        "type": "phuong"
      },
      {
        "code": "27417",
        "name": "Phường Hoài Nhơn Bắc",
        "type": "phuong"
      },
      {
        "code": "26649",
        "name": "Phường Hoài Nhơn Đông",
        "type": "phuong"
      },
      {
        "code": "27161",
        "name": "Phường Hoài Nhơn Nam",
        "type": "phuong"
      },
      {
        "code": "26905",
        "name": "Phường Hoài Nhơn Tây",
        "type": "phuong"
      },
      {
        "code": "4889",
        "name": "Phường Hội Phú",
        "type": "phuong"
      },
      {
        "code": "4633",
        "name": "Phường Pleiku",
        "type": "phuong"
      },
      {
        "code": "23321",
        "name": "Phường Quy Nhơn",
        "type": "phuong"
      },
      {
        "code": "24089",
        "name": "Phường Quy Nhơn Bắc",
        "type": "phuong"
      },
      {
        "code": "3353",
        "name": "Phường Quy Nhơn Đông",
        "type": "phuong"
      },
      {
        "code": "23833",
        "name": "Phường Quy Nhơn Nam",
        "type": "phuong"
      },
      {
        "code": "23577",
        "name": "Phường Quy Nhơn Tây",
        "type": "phuong"
      },
      {
        "code": "26393",
        "name": "Phường Tam Quan",
        "type": "phuong"
      },
      {
        "code": "5145",
        "name": "Phường Thống Nhất",
        "type": "phuong"
      },
      {
        "code": "9753",
        "name": "Xã Al Bá",
        "type": "xa"
      },
      {
        "code": "2841",
        "name": "Xã An Hòa",
        "type": "xa"
      },
      {
        "code": "34329",
        "name": "Xã An Lão",
        "type": "xa"
      },
      {
        "code": "28697",
        "name": "Xã An Lương",
        "type": "xa"
      },
      {
        "code": "25113",
        "name": "Xã An Nhơn Tây",
        "type": "xa"
      },
      {
        "code": "793",
        "name": "Xã An Toàn",
        "type": "xa"
      },
      {
        "code": "34585",
        "name": "Xã An Vinh",
        "type": "xa"
      },
      {
        "code": "20505",
        "name": "Xã Ayun",
        "type": "xa"
      },
      {
        "code": "33049",
        "name": "Xã Ân Hảo",
        "type": "xa"
      },
      {
        "code": "32281",
        "name": "Xã Ân Tường",
        "type": "xa"
      },
      {
        "code": "7705",
        "name": "Xã Bàu Cạn",
        "type": "xa"
      },
      {
        "code": "5913",
        "name": "Xã Biển Hồ",
        "type": "xa"
      },
      {
        "code": "31769",
        "name": "Xã Bình An",
        "type": "xa"
      },
      {
        "code": "28953",
        "name": "Xã Bình Dương",
        "type": "xa"
      },
      {
        "code": "31513",
        "name": "Xã Bình Hiệp",
        "type": "xa"
      },
      {
        "code": "31001",
        "name": "Xã Bình Khê",
        "type": "xa"
      },
      {
        "code": "31257",
        "name": "Xã Bình Phú",
        "type": "xa"
      },
      {
        "code": "9241",
        "name": "Xã Bờ Ngoong",
        "type": "xa"
      },
      {
        "code": "281",
        "name": "Xã Canh Liên",
        "type": "xa"
      },
      {
        "code": "2585",
        "name": "Xã Canh Vinh",
        "type": "xa"
      },
      {
        "code": "22553",
        "name": "Xã Cát Tiến",
        "type": "xa"
      },
      {
        "code": "14617",
        "name": "Xã Chơ Long",
        "type": "xa"
      },
      {
        "code": "15897",
        "name": "Xã Chư A Thai",
        "type": "xa"
      },
      {
        "code": "13849",
        "name": "Xã Chư Krey",
        "type": "xa"
      },
      {
        "code": "6681",
        "name": "Xã Chư Păh",
        "type": "xa"
      },
      {
        "code": "7449",
        "name": "Xã Chư Prông",
        "type": "xa"
      },
      {
        "code": "10009",
        "name": "Xã Chư Pưh",
        "type": "xa"
      },
      {
        "code": "8985",
        "name": "Xã Chư Sê",
        "type": "xa"
      },
      {
        "code": "11289",
        "name": "Xã Cửu An",
        "type": "xa"
      },
      {
        "code": "18201",
        "name": "Xã Đak Đoa",
        "type": "xa"
      },
      {
        "code": "11545",
        "name": "Xã Đak Pơ",
        "type": "xa"
      },
      {
        "code": "13081",
        "name": "Xã Đak Rong",
        "type": "xa"
      },
      {
        "code": "19225",
        "name": "Xã Đak Sơmei",
        "type": "xa"
      },
      {
        "code": "14361",
        "name": "Xã Đăk Song",
        "type": "xa"
      },
      {
        "code": "22809",
        "name": "Xã Đề Gi",
        "type": "xa"
      },
      {
        "code": "21529",
        "name": "Xã Đức Cơ",
        "type": "xa"
      },
      {
        "code": "6169",
        "name": "Xã Gào",
        "type": "xa"
      },
      {
        "code": "23065",
        "name": "Xã Hòa Hội",
        "type": "xa"
      },
      {
        "code": "32025",
        "name": "Xã Hoài Ân",
        "type": "xa"
      },
      {
        "code": "28185",
        "name": "Xã Hội Sơn",
        "type": "xa"
      },
      {
        "code": "20249",
        "name": "Xã Hra",
        "type": "xa"
      },
      {
        "code": "18713",
        "name": "Xã Ia Băng",
        "type": "xa"
      },
      {
        "code": "7961",
        "name": "Xã Ia Boòng",
        "type": "xa"
      },
      {
        "code": "3865",
        "name": "Xã Ia Chia",
        "type": "xa"
      },
      {
        "code": "1817",
        "name": "Xã Ia Dom",
        "type": "xa"
      },
      {
        "code": "21785",
        "name": "Xã Ia Dơk",
        "type": "xa"
      },
      {
        "code": "17433",
        "name": "Xã Ia Dreh",
        "type": "xa"
      },
      {
        "code": "20761",
        "name": "Xã Ia Grai",
        "type": "xa"
      },
      {
        "code": "16153",
        "name": "Xã Ia Hiao",
        "type": "xa"
      },
      {
        "code": "10521",
        "name": "Xã Ia Hrú",
        "type": "xa"
      },
      {
        "code": "21273",
        "name": "Xã Ia Hrung",
        "type": "xa"
      },
      {
        "code": "6937",
        "name": "Xã Ia Khươl",
        "type": "xa"
      },
      {
        "code": "9497",
        "name": "Xã Ia Ko",
        "type": "xa"
      },
      {
        "code": "21017",
        "name": "Xã Ia Krái",
        "type": "xa"
      },
      {
        "code": "22041",
        "name": "Xã Ia Krêl",
        "type": "xa"
      },
      {
        "code": "8217",
        "name": "Xã Ia Lâu",
        "type": "xa"
      },
      {
        "code": "10265",
        "name": "Xã Ia Le",
        "type": "xa"
      },
      {
        "code": "6425",
        "name": "Xã Ia Ly",
        "type": "xa"
      },
      {
        "code": "1561",
        "name": "Xã Ia Mơ",
        "type": "xa"
      },
      {
        "code": "2073",
        "name": "Xã Ia Nan",
        "type": "xa"
      },
      {
        "code": "4121",
        "name": "Xã Ia O",
        "type": "xa"
      },
      {
        "code": "16665",
        "name": "Xã Ia Pa",
        "type": "xa"
      },
      {
        "code": "7193",
        "name": "Xã Ia Phí",
        "type": "xa"
      },
      {
        "code": "8473",
        "name": "Xã Ia Pia",
        "type": "xa"
      },
      {
        "code": "2329",
        "name": "Xã Ia Pnôn",
        "type": "xa"
      },
      {
        "code": "1305",
        "name": "Xã Ia Púch",
        "type": "xa"
      },
      {
        "code": "15129",
        "name": "Xã Ia Rbol",
        "type": "xa"
      },
      {
        "code": "17689",
        "name": "Xã Ia Rsai",
        "type": "xa"
      },
      {
        "code": "15385",
        "name": "Xã Ia Sao",
        "type": "xa"
      },
      {
        "code": "8729",
        "name": "Xã Ia Tôr",
        "type": "xa"
      },
      {
        "code": "16921",
        "name": "Xã Ia Tul",
        "type": "xa"
      },
      {
        "code": "12057",
        "name": "Xã Kbang",
        "type": "xa"
      },
      {
        "code": "18969",
        "name": "Xã KDang",
        "type": "xa"
      },
      {
        "code": "32537",
        "name": "Xã Kim Sơn",
        "type": "xa"
      },
      {
        "code": "19993",
        "name": "Xã Kon Chiêng",
        "type": "xa"
      },
      {
        "code": "18457",
        "name": "Xã Kon Gang",
        "type": "xa"
      },
      {
        "code": "12313",
        "name": "Xã Kông Bơ La",
        "type": "xa"
      },
      {
        "code": "13337",
        "name": "Xã Kông Chro",
        "type": "xa"
      },
      {
        "code": "4377",
        "name": "Xã Krong",
        "type": "xa"
      },
      {
        "code": "19737",
        "name": "Xã Lơ Pang",
        "type": "xa"
      },
      {
        "code": "19481",
        "name": "Xã Mang Yang",
        "type": "xa"
      },
      {
        "code": "22297",
        "name": "Xã Ngô Mây",
        "type": "xa"
      },
      {
        "code": "537",
        "name": "Xã Nhơn Châu",
        "type": "xa"
      },
      {
        "code": "27673",
        "name": "Xã Phù Cát",
        "type": "xa"
      },
      {
        "code": "28441",
        "name": "Xã Phù Mỹ",
        "type": "xa"
      },
      {
        "code": "29721",
        "name": "Xã Phù Mỹ Bắc",
        "type": "xa"
      },
      {
        "code": "3097",
        "name": "Xã Phù Mỹ Đông",
        "type": "xa"
      },
      {
        "code": "29465",
        "name": "Xã Phù Mỹ Nam",
        "type": "xa"
      },
      {
        "code": "29209",
        "name": "Xã Phù Mỹ Tây",
        "type": "xa"
      },
      {
        "code": "15641",
        "name": "Xã Phú Thiện",
        "type": "xa"
      },
      {
        "code": "17177",
        "name": "Xã Phú Túc",
        "type": "xa"
      },
      {
        "code": "16409",
        "name": "Xã Pờ Tó",
        "type": "xa"
      },
      {
        "code": "12825",
        "name": "Xã Sơn Lang",
        "type": "xa"
      },
      {
        "code": "14105",
        "name": "Xã SRó",
        "type": "xa"
      },
      {
        "code": "3609",
        "name": "Xã Tây Sơn",
        "type": "xa"
      },
      {
        "code": "12569",
        "name": "Xã Tơ Tung",
        "type": "xa"
      },
      {
        "code": "29977",
        "name": "Xã Tuy Phước",
        "type": "xa"
      },
      {
        "code": "30745",
        "name": "Xã Tuy Phước Bắc",
        "type": "xa"
      },
      {
        "code": "30233",
        "name": "Xã Tuy Phước Đông",
        "type": "xa"
      },
      {
        "code": "30489",
        "name": "Xã Tuy Phước Tây",
        "type": "xa"
      },
      {
        "code": "17945",
        "name": "Xã Uar",
        "type": "xa"
      },
      {
        "code": "32793",
        "name": "Xã Vạn Đức",
        "type": "xa"
      },
      {
        "code": "1049",
        "name": "Xã Vân Canh",
        "type": "xa"
      },
      {
        "code": "33817",
        "name": "Xã Vĩnh Quang",
        "type": "xa"
      },
      {
        "code": "34073",
        "name": "Xã Vĩnh Sơn",
        "type": "xa"
      },
      {
        "code": "33305",
        "name": "Xã Vĩnh Thạnh",
        "type": "xa"
      },
      {
        "code": "33561",
        "name": "Xã Vĩnh Thịnh",
        "type": "xa"
      },
      {
        "code": "27929",
        "name": "Xã Xuân An",
        "type": "xa"
      },
      {
        "code": "11801",
        "name": "Xã Ya Hội",
        "type": "xa"
      },
      {
        "code": "13593",
        "name": "Xã Ya Ma",
        "type": "xa"
      }
    ]
  },
  {
    "code": "26",
    "name": "Hà Tĩnh",
    "wards": [
      {
        "code": "13850",
        "name": "Phường Bắc Hồng Lĩnh",
        "type": "phuong"
      },
      {
        "code": "2330",
        "name": "Phường Hà Huy Tập",
        "type": "phuong"
      },
      {
        "code": "7706",
        "name": "Phường Hải Ninh",
        "type": "phuong"
      },
      {
        "code": "794",
        "name": "Phường Hoành Sơn",
        "type": "phuong"
      },
      {
        "code": "14106",
        "name": "Phường Nam Hồng Lĩnh",
        "type": "phuong"
      },
      {
        "code": "2074",
        "name": "Phường Sông Trí",
        "type": "phuong"
      },
      {
        "code": "2586",
        "name": "Phường Thành Sen",
        "type": "phuong"
      },
      {
        "code": "11034",
        "name": "Phường Trần Phú",
        "type": "phuong"
      },
      {
        "code": "1818",
        "name": "Phường Vũng Áng",
        "type": "phuong"
      },
      {
        "code": "13594",
        "name": "Xã Can Lộc",
        "type": "xa"
      },
      {
        "code": "12058",
        "name": "Xã Cẩm Bình",
        "type": "xa"
      },
      {
        "code": "9754",
        "name": "Xã Cẩm Duệ",
        "type": "xa"
      },
      {
        "code": "10010",
        "name": "Xã Cẩm Hưng",
        "type": "xa"
      },
      {
        "code": "10266",
        "name": "Xã Cẩm Lạc",
        "type": "xa"
      },
      {
        "code": "10522",
        "name": "Xã Cẩm Trung",
        "type": "xa"
      },
      {
        "code": "9498",
        "name": "Xã Cẩm Xuyên",
        "type": "xa"
      },
      {
        "code": "14874",
        "name": "Xã Cổ Đạm",
        "type": "xa"
      },
      {
        "code": "1562",
        "name": "Xã Đan Hải",
        "type": "xa"
      },
      {
        "code": "12826",
        "name": "Xã Đông Kinh",
        "type": "xa"
      },
      {
        "code": "17690",
        "name": "Xã Đồng Lộc",
        "type": "xa"
      },
      {
        "code": "11546",
        "name": "Xã Đồng Tiến",
        "type": "xa"
      },
      {
        "code": "5658",
        "name": "Xã Đức Đồng",
        "type": "xa"
      },
      {
        "code": "4378",
        "name": "Xã Đức Minh",
        "type": "xa"
      },
      {
        "code": "15642",
        "name": "Xã Đức Quang",
        "type": "xa"
      },
      {
        "code": "14362",
        "name": "Xã Đức Thịnh",
        "type": "xa"
      },
      {
        "code": "15386",
        "name": "Xã Đức Thọ",
        "type": "xa"
      },
      {
        "code": "16154",
        "name": "Xã Gia Hanh",
        "type": "xa"
      },
      {
        "code": "6682",
        "name": "Xã Hà Linh",
        "type": "xa"
      },
      {
        "code": "16666",
        "name": "Xã Hồng Lộc",
        "type": "xa"
      },
      {
        "code": "5914",
        "name": "Xã Hương Bình",
        "type": "xa"
      },
      {
        "code": "6938",
        "name": "Xã Hương Đô",
        "type": "xa"
      },
      {
        "code": "15898",
        "name": "Xã Hương Khê",
        "type": "xa"
      },
      {
        "code": "7194",
        "name": "Xã Hương Phố",
        "type": "xa"
      },
      {
        "code": "3866",
        "name": "Xã Hương Sơn",
        "type": "xa"
      },
      {
        "code": "6170",
        "name": "Xã Hương Xuân",
        "type": "xa"
      },
      {
        "code": "4634",
        "name": "Xã Kim Hoa",
        "type": "xa"
      },
      {
        "code": "7962",
        "name": "Xã Kỳ Anh",
        "type": "xa"
      },
      {
        "code": "8218",
        "name": "Xã Kỳ Hoa",
        "type": "xa"
      },
      {
        "code": "8730",
        "name": "Xã Kỳ Khang",
        "type": "xa"
      },
      {
        "code": "8986",
        "name": "Xã Kỳ Lạc",
        "type": "xa"
      },
      {
        "code": "9242",
        "name": "Xã Kỳ Thượng",
        "type": "xa"
      },
      {
        "code": "8474",
        "name": "Xã Kỳ Văn",
        "type": "xa"
      },
      {
        "code": "538",
        "name": "Xã Kỳ Xuân",
        "type": "xa"
      },
      {
        "code": "16922",
        "name": "Xã Lộc Hà",
        "type": "xa"
      },
      {
        "code": "5146",
        "name": "Xã Mai Hoa",
        "type": "xa"
      },
      {
        "code": "17178",
        "name": "Xã Mai Phụ",
        "type": "xa"
      },
      {
        "code": "14618",
        "name": "Xã Nghi Xuân",
        "type": "xa"
      },
      {
        "code": "6426",
        "name": "Xã Phúc Trạch",
        "type": "xa"
      },
      {
        "code": "3354",
        "name": "Xã Sơn Giang",
        "type": "xa"
      },
      {
        "code": "2842",
        "name": "Xã Sơn Hồng",
        "type": "xa"
      },
      {
        "code": "1050",
        "name": "Xã Sơn Kim 1",
        "type": "xa"
      },
      {
        "code": "1306",
        "name": "Xã Sơn Kim 2",
        "type": "xa"
      },
      {
        "code": "3098",
        "name": "Xã Sơn Tây",
        "type": "xa"
      },
      {
        "code": "3610",
        "name": "Xã Sơn Tiến",
        "type": "xa"
      },
      {
        "code": "12314",
        "name": "Xã Thạch Hà",
        "type": "xa"
      },
      {
        "code": "11802",
        "name": "Xã Thạch Khê",
        "type": "xa"
      },
      {
        "code": "11290",
        "name": "Xã Thạch Lạc",
        "type": "xa"
      },
      {
        "code": "13082",
        "name": "Xã Thạch Xuân",
        "type": "xa"
      },
      {
        "code": "282",
        "name": "Xã Thiên Cầm",
        "type": "xa"
      },
      {
        "code": "5402",
        "name": "Xã Thượng Đức",
        "type": "xa"
      },
      {
        "code": "15130",
        "name": "Xã Tiên Điền",
        "type": "xa"
      },
      {
        "code": "7450",
        "name": "Xã Toàn Lưu",
        "type": "xa"
      },
      {
        "code": "16410",
        "name": "Xã Trường Lưu",
        "type": "xa"
      },
      {
        "code": "17434",
        "name": "Xã Tùng Lộc",
        "type": "xa"
      },
      {
        "code": "4122",
        "name": "Xã Tứ Mỹ",
        "type": "xa"
      },
      {
        "code": "12570",
        "name": "Xã Việt Xuyên",
        "type": "xa"
      },
      {
        "code": "4890",
        "name": "Xã Vũ Quang",
        "type": "xa"
      },
      {
        "code": "13338",
        "name": "Xã Xuân Lộc",
        "type": "xa"
      },
      {
        "code": "10778",
        "name": "Xã Yên Hòa",
        "type": "xa"
      }
    ]
  },
  {
    "code": "27",
    "name": "Hưng Yên",
    "wards": [
      {
        "code": "8219",
        "name": "Phường Đường Hào",
        "type": "phuong"
      },
      {
        "code": "1307",
        "name": "Phường Hồng Châu",
        "type": "phuong"
      },
      {
        "code": "7963",
        "name": "Phường Mỹ Hào",
        "type": "phuong"
      },
      {
        "code": "1051",
        "name": "Phường Phố Hiến",
        "type": "phuong"
      },
      {
        "code": "795",
        "name": "Phường Sơn Nam",
        "type": "phuong"
      },
      {
        "code": "10523",
        "name": "Phường Thái Bình",
        "type": "phuong"
      },
      {
        "code": "8475",
        "name": "Phường Thượng Hồng",
        "type": "phuong"
      },
      {
        "code": "11291",
        "name": "Phường Trà Lý",
        "type": "phuong"
      },
      {
        "code": "11035",
        "name": "Phường Trần Hưng Đạo",
        "type": "phuong"
      },
      {
        "code": "10779",
        "name": "Phường Trần Lãm",
        "type": "phuong"
      },
      {
        "code": "11547",
        "name": "Phường Vũ Phúc",
        "type": "phuong"
      },
      {
        "code": "24603",
        "name": "Xã A Sào",
        "type": "xa"
      },
      {
        "code": "14875",
        "name": "Xã Ái Quốc",
        "type": "xa"
      },
      {
        "code": "4379",
        "name": "Xã Ân Thi",
        "type": "xa"
      },
      {
        "code": "26651",
        "name": "Xã Bắc Đông Hưng",
        "type": "xa"
      },
      {
        "code": "26395",
        "name": "Xã Bắc Đông Quan",
        "type": "xa"
      },
      {
        "code": "13083",
        "name": "Xã Bắc Thái Ninh",
        "type": "xa"
      },
      {
        "code": "12315",
        "name": "Xã Bắc Thụy Anh",
        "type": "xa"
      },
      {
        "code": "25627",
        "name": "Xã Bắc Tiên Hưng",
        "type": "xa"
      },
      {
        "code": "20251",
        "name": "Xã Bình Định",
        "type": "xa"
      },
      {
        "code": "20763",
        "name": "Xã Bình Nguyên",
        "type": "xa"
      },
      {
        "code": "19995",
        "name": "Xã Bình Thanh",
        "type": "xa"
      },
      {
        "code": "6683",
        "name": "Xã Châu Ninh",
        "type": "xa"
      },
      {
        "code": "6427",
        "name": "Xã Chí Minh",
        "type": "xa"
      },
      {
        "code": "18203",
        "name": "Xã Diên Hà",
        "type": "xa"
      },
      {
        "code": "9243",
        "name": "Xã Đại Đồng",
        "type": "xa"
      },
      {
        "code": "2843",
        "name": "Xã Đoàn Đào",
        "type": "xa"
      },
      {
        "code": "24347",
        "name": "Xã Đồng Bằng",
        "type": "xa"
      },
      {
        "code": "15131",
        "name": "Xã Đồng Châu",
        "type": "xa"
      },
      {
        "code": "25371",
        "name": "Xã Đông Hưng",
        "type": "xa"
      },
      {
        "code": "16155",
        "name": "Xã Đông Quan",
        "type": "xa"
      },
      {
        "code": "539",
        "name": "Xã Đông Thái Ninh",
        "type": "xa"
      },
      {
        "code": "12059",
        "name": "Xã Đông Thụy Anh",
        "type": "xa"
      },
      {
        "code": "15387",
        "name": "Xã Đông Tiền Hải",
        "type": "xa"
      },
      {
        "code": "25883",
        "name": "Xã Đông Tiên Hưng",
        "type": "xa"
      },
      {
        "code": "4123",
        "name": "Xã Đức Hợp",
        "type": "xa"
      },
      {
        "code": "283",
        "name": "Xã Hiệp Cường",
        "type": "xa"
      },
      {
        "code": "7451",
        "name": "Xã Hoàn Long",
        "type": "xa"
      },
      {
        "code": "1819",
        "name": "Xã Hoàng Hoa Thám",
        "type": "xa"
      },
      {
        "code": "17691",
        "name": "Xã Hồng Minh",
        "type": "xa"
      },
      {
        "code": "5403",
        "name": "Xã Hồng Quang",
        "type": "xa"
      },
      {
        "code": "20507",
        "name": "Xã Hồng Vũ",
        "type": "xa"
      },
      {
        "code": "16923",
        "name": "Xã Hưng Hà",
        "type": "xa"
      },
      {
        "code": "15899",
        "name": "Xã Hưng Phú",
        "type": "xa"
      },
      {
        "code": "5659",
        "name": "Xã Khoái Châu",
        "type": "xa"
      },
      {
        "code": "18971",
        "name": "Xã Kiến Xương",
        "type": "xa"
      },
      {
        "code": "8987",
        "name": "Xã Lạc Đạo",
        "type": "xa"
      },
      {
        "code": "19227",
        "name": "Xã Lê Lợi",
        "type": "xa"
      },
      {
        "code": "17435",
        "name": "Xã Lê Quý Đôn",
        "type": "xa"
      },
      {
        "code": "18715",
        "name": "Xã Long Hưng",
        "type": "xa"
      },
      {
        "code": "3611",
        "name": "Xã Lương Bằng",
        "type": "xa"
      },
      {
        "code": "10267",
        "name": "Xã Mễ Sở",
        "type": "xa"
      },
      {
        "code": "23323",
        "name": "Xã Minh Thọ",
        "type": "xa"
      },
      {
        "code": "15643",
        "name": "Xã Nam Cường",
        "type": "xa"
      },
      {
        "code": "26139",
        "name": "Xã Nam Đông Hưng",
        "type": "xa"
      },
      {
        "code": "13595",
        "name": "Xã Nam Thái Ninh",
        "type": "xa"
      },
      {
        "code": "12827",
        "name": "Xã Nam Thụy Anh",
        "type": "xa"
      },
      {
        "code": "22811",
        "name": "Xã Nam Tiền Hải",
        "type": "xa"
      },
      {
        "code": "16411",
        "name": "Xã Nam Tiên Hưng",
        "type": "xa"
      },
      {
        "code": "3867",
        "name": "Xã Nghĩa Dân",
        "type": "xa"
      },
      {
        "code": "9499",
        "name": "Xã Nghĩa Trụ",
        "type": "xa"
      },
      {
        "code": "24091",
        "name": "Xã Ngọc Lâm",
        "type": "xa"
      },
      {
        "code": "23579",
        "name": "Xã Nguyễn Du",
        "type": "xa"
      },
      {
        "code": "5147",
        "name": "Xã Nguyễn Trãi",
        "type": "xa"
      },
      {
        "code": "7707",
        "name": "Xã Nguyễn Văn Linh",
        "type": "xa"
      },
      {
        "code": "18459",
        "name": "Xã Ngự Thiên",
        "type": "xa"
      },
      {
        "code": "8731",
        "name": "Xã Như Quỳnh",
        "type": "xa"
      },
      {
        "code": "4891",
        "name": "Xã Phạm Ngũ Lão",
        "type": "xa"
      },
      {
        "code": "24859",
        "name": "Xã Phụ Dực",
        "type": "xa"
      },
      {
        "code": "9755",
        "name": "Xã Phụng Công",
        "type": "xa"
      },
      {
        "code": "2587",
        "name": "Xã Quang Hưng",
        "type": "xa"
      },
      {
        "code": "19483",
        "name": "Xã Quang Lịch",
        "type": "xa"
      },
      {
        "code": "23835",
        "name": "Xã Quỳnh An",
        "type": "xa"
      },
      {
        "code": "23067",
        "name": "Xã Quỳnh Phụ",
        "type": "xa"
      },
      {
        "code": "1563",
        "name": "Xã Tân Hưng",
        "type": "xa"
      },
      {
        "code": "21787",
        "name": "Xã Tân Thuận",
        "type": "xa"
      },
      {
        "code": "25115",
        "name": "Xã Tân Tiến",
        "type": "xa"
      },
      {
        "code": "13851",
        "name": "Xã Tây Thái Ninh",
        "type": "xa"
      },
      {
        "code": "14107",
        "name": "Xã Tây Thụy Anh",
        "type": "xa"
      },
      {
        "code": "14619",
        "name": "Xã Tây Tiền Hải",
        "type": "xa"
      },
      {
        "code": "13339",
        "name": "Xã Thái Ninh",
        "type": "xa"
      },
      {
        "code": "11803",
        "name": "Xã Thái Thụy",
        "type": "xa"
      },
      {
        "code": "17947",
        "name": "Xã Thần Khê",
        "type": "xa"
      },
      {
        "code": "12571",
        "name": "Xã Thụy Anh",
        "type": "xa"
      },
      {
        "code": "21531",
        "name": "Xã Thư Trì",
        "type": "xa"
      },
      {
        "code": "22043",
        "name": "Xã Thư Vũ",
        "type": "xa"
      },
      {
        "code": "14363",
        "name": "Xã Tiền Hải",
        "type": "xa"
      },
      {
        "code": "2331",
        "name": "Xã Tiên Hoa",
        "type": "xa"
      },
      {
        "code": "16667",
        "name": "Xã Tiên Hưng",
        "type": "xa"
      },
      {
        "code": "17179",
        "name": "Xã Tiên La",
        "type": "xa"
      },
      {
        "code": "2075",
        "name": "Xã Tiên Lữ",
        "type": "xa"
      },
      {
        "code": "3099",
        "name": "Xã Tiên Tiến",
        "type": "xa"
      },
      {
        "code": "3355",
        "name": "Xã Tống Trân",
        "type": "xa"
      },
      {
        "code": "21019",
        "name": "Xã Trà Giang",
        "type": "xa"
      },
      {
        "code": "5915",
        "name": "Xã Triệu Việt Vương",
        "type": "xa"
      },
      {
        "code": "22555",
        "name": "Xã Vạn Xuân",
        "type": "xa"
      },
      {
        "code": "10011",
        "name": "Xã Văn Giang",
        "type": "xa"
      },
      {
        "code": "6171",
        "name": "Xã Việt Tiến",
        "type": "xa"
      },
      {
        "code": "7195",
        "name": "Xã Việt Yên",
        "type": "xa"
      },
      {
        "code": "19739",
        "name": "Xã Vũ Quý",
        "type": "xa"
      },
      {
        "code": "21275",
        "name": "Xã Vũ Thư",
        "type": "xa"
      },
      {
        "code": "22299",
        "name": "Xã Vũ Tiên",
        "type": "xa"
      },
      {
        "code": "4635",
        "name": "Xã Xuân Trúc",
        "type": "xa"
      },
      {
        "code": "6939",
        "name": "Xã Yên Mỹ",
        "type": "xa"
      }
    ]
  },
  {
    "code": "28",
    "name": "Khánh Hòa",
    "wards": [
      {
        "code": "5404",
        "name": "Đặc Khu Trường Sa",
        "type": "dac-khu"
      },
      {
        "code": "6684",
        "name": "Phường Ba Ngòi",
        "type": "phuong"
      },
      {
        "code": "796",
        "name": "Phường Bảo An",
        "type": "phuong"
      },
      {
        "code": "2332",
        "name": "Phường Bắc Cam Ranh",
        "type": "phuong"
      },
      {
        "code": "3356",
        "name": "Phường Bắc Nha Trang",
        "type": "phuong"
      },
      {
        "code": "6428",
        "name": "Phường Cam Linh",
        "type": "phuong"
      },
      {
        "code": "6172",
        "name": "Phường Cam Ranh",
        "type": "phuong"
      },
      {
        "code": "284",
        "name": "Phường Đô Vinh",
        "type": "phuong"
      },
      {
        "code": "16668",
        "name": "Phường Đông Hải",
        "type": "phuong"
      },
      {
        "code": "5148",
        "name": "Phường Đông Ninh Hòa",
        "type": "phuong"
      },
      {
        "code": "7708",
        "name": "Phường Hòa Thắng",
        "type": "phuong"
      },
      {
        "code": "5916",
        "name": "Phường Nam Nha Trang",
        "type": "phuong"
      },
      {
        "code": "3100",
        "name": "Phường Nha Trang",
        "type": "phuong"
      },
      {
        "code": "3612",
        "name": "Phường Ninh Chử",
        "type": "phuong"
      },
      {
        "code": "7196",
        "name": "Phường Ninh Hòa",
        "type": "phuong"
      },
      {
        "code": "540",
        "name": "Phường Phan Rang",
        "type": "phuong"
      },
      {
        "code": "5660",
        "name": "Phường Tây Nha Trang",
        "type": "phuong"
      },
      {
        "code": "15388",
        "name": "Xã Anh Dũng",
        "type": "xa"
      },
      {
        "code": "16156",
        "name": "Xã Bác Ái",
        "type": "xa"
      },
      {
        "code": "15900",
        "name": "Xã Bác Ái Đông",
        "type": "xa"
      },
      {
        "code": "16412",
        "name": "Xã Bác Ái Tây",
        "type": "xa"
      },
      {
        "code": "10268",
        "name": "Xã Bắc Khánh Vĩnh",
        "type": "xa"
      },
      {
        "code": "6940",
        "name": "Xã Bắc Ninh Hòa",
        "type": "xa"
      },
      {
        "code": "13340",
        "name": "Xã Cà Ná",
        "type": "xa"
      },
      {
        "code": "4380",
        "name": "Xã Cam An",
        "type": "xa"
      },
      {
        "code": "4636",
        "name": "Xã Cam Hiệp",
        "type": "xa"
      },
      {
        "code": "4124",
        "name": "Xã Cam Lâm",
        "type": "xa"
      },
      {
        "code": "14620",
        "name": "Xã Công Hải",
        "type": "xa"
      },
      {
        "code": "9244",
        "name": "Xã Diên Điền",
        "type": "xa"
      },
      {
        "code": "8732",
        "name": "Xã Diên Khánh",
        "type": "xa"
      },
      {
        "code": "8988",
        "name": "Xã Diên Lạc",
        "type": "xa"
      },
      {
        "code": "9500",
        "name": "Xã Diên Lâm",
        "type": "xa"
      },
      {
        "code": "9756",
        "name": "Xã Diên Thọ",
        "type": "xa"
      },
      {
        "code": "2076",
        "name": "Xã Đại Lãnh",
        "type": "xa"
      },
      {
        "code": "12060",
        "name": "Xã Đông Khánh Sơn",
        "type": "xa"
      },
      {
        "code": "8220",
        "name": "Xã Hòa Trí",
        "type": "xa"
      },
      {
        "code": "11548",
        "name": "Xã Khánh Sơn",
        "type": "xa"
      },
      {
        "code": "11292",
        "name": "Xã Khánh Vĩnh",
        "type": "xa"
      },
      {
        "code": "15132",
        "name": "Xã Lâm Sơn",
        "type": "xa"
      },
      {
        "code": "15644",
        "name": "Xã Mỹ Sơn",
        "type": "xa"
      },
      {
        "code": "2588",
        "name": "Xã Nam Cam Ranh",
        "type": "xa"
      },
      {
        "code": "11036",
        "name": "Xã Nam Khánh Vĩnh",
        "type": "xa"
      },
      {
        "code": "1052",
        "name": "Xã Nam Ninh Hòa",
        "type": "xa"
      },
      {
        "code": "13852",
        "name": "Xã Ninh Hải",
        "type": "xa"
      },
      {
        "code": "12316",
        "name": "Xã Ninh Phước",
        "type": "xa"
      },
      {
        "code": "14876",
        "name": "Xã Ninh Sơn",
        "type": "xa"
      },
      {
        "code": "2844",
        "name": "Xã Phước Dinh",
        "type": "xa"
      },
      {
        "code": "13596",
        "name": "Xã Phước Hà",
        "type": "xa"
      },
      {
        "code": "12828",
        "name": "Xã Phước Hậu",
        "type": "xa"
      },
      {
        "code": "12572",
        "name": "Xã Phước Hữu",
        "type": "xa"
      },
      {
        "code": "4892",
        "name": "Xã Suối Dầu",
        "type": "xa"
      },
      {
        "code": "10012",
        "name": "Xã Suối Hiệp",
        "type": "xa"
      },
      {
        "code": "7452",
        "name": "Xã Tân Định",
        "type": "xa"
      },
      {
        "code": "11804",
        "name": "Xã Tây Khánh Sơn",
        "type": "xa"
      },
      {
        "code": "10780",
        "name": "Xã Tây Khánh Vĩnh",
        "type": "xa"
      },
      {
        "code": "7964",
        "name": "Xã Tây Ninh Hòa",
        "type": "xa"
      },
      {
        "code": "14364",
        "name": "Xã Thuận Bắc",
        "type": "xa"
      },
      {
        "code": "13084",
        "name": "Xã Thuận Nam",
        "type": "xa"
      },
      {
        "code": "10524",
        "name": "Xã Trung Khánh Vĩnh",
        "type": "xa"
      },
      {
        "code": "1564",
        "name": "Xã Tu Bông",
        "type": "xa"
      },
      {
        "code": "1308",
        "name": "Xã Vạn Hưng",
        "type": "xa"
      },
      {
        "code": "8476",
        "name": "Xã Vạn Ninh",
        "type": "xa"
      },
      {
        "code": "1820",
        "name": "Xã Vạn Thắng",
        "type": "xa"
      },
      {
        "code": "3868",
        "name": "Xã Vĩnh Hải",
        "type": "xa"
      },
      {
        "code": "14108",
        "name": "Xã Xuân Hải",
        "type": "xa"
      }
    ]
  },
  {
    "code": "29",
    "name": "Lai Châu",
    "wards": [
      {
        "code": "5661",
        "name": "Phường Đoàn Kết",
        "type": "phuong"
      },
      {
        "code": "5405",
        "name": "Phường Tân Phong",
        "type": "phuong"
      },
      {
        "code": "4381",
        "name": "Xã Bản Bo",
        "type": "xa"
      },
      {
        "code": "4637",
        "name": "Xã Bình Lư",
        "type": "xa"
      },
      {
        "code": "9245",
        "name": "Xã Bum Nưa",
        "type": "xa"
      },
      {
        "code": "9501",
        "name": "Xã Bum Tở",
        "type": "xa"
      },
      {
        "code": "6685",
        "name": "Xã Dào San",
        "type": "xa"
      },
      {
        "code": "7709",
        "name": "Xã Hồng Thu",
        "type": "xa"
      },
      {
        "code": "8733",
        "name": "Xã Hua Bum",
        "type": "xa"
      },
      {
        "code": "2589",
        "name": "Xã Khoen On",
        "type": "xa"
      },
      {
        "code": "6941",
        "name": "Xã Khổng Lào",
        "type": "xa"
      },
      {
        "code": "5149",
        "name": "Xã Khun Há",
        "type": "xa"
      },
      {
        "code": "1821",
        "name": "Xã Lê Lợi",
        "type": "xa"
      },
      {
        "code": "541",
        "name": "Xã Mù Cả",
        "type": "xa"
      },
      {
        "code": "4125",
        "name": "Xã Mường Khoa",
        "type": "xa"
      },
      {
        "code": "2333",
        "name": "Xã Mường Kim",
        "type": "xa"
      },
      {
        "code": "8477",
        "name": "Xã Mường Mô",
        "type": "xa"
      },
      {
        "code": "9757",
        "name": "Xã Mường Tè",
        "type": "xa"
      },
      {
        "code": "3101",
        "name": "Xã Mường Than",
        "type": "xa"
      },
      {
        "code": "1309",
        "name": "Xã Nậm Cuổi",
        "type": "xa"
      },
      {
        "code": "2077",
        "name": "Xã Nậm Hàng",
        "type": "xa"
      },
      {
        "code": "1565",
        "name": "Xã Nậm Mạ",
        "type": "xa"
      },
      {
        "code": "3613",
        "name": "Xã Nậm Sỏ",
        "type": "xa"
      },
      {
        "code": "7965",
        "name": "Xã Nậm Tăm",
        "type": "xa"
      },
      {
        "code": "8989",
        "name": "Xã Pa Tần",
        "type": "xa"
      },
      {
        "code": "1053",
        "name": "Xã Pa Ủ",
        "type": "xa"
      },
      {
        "code": "3357",
        "name": "Xã Pắc Ta",
        "type": "xa"
      },
      {
        "code": "6173",
        "name": "Xã Phong Thổ",
        "type": "xa"
      },
      {
        "code": "8221",
        "name": "Xã Pu Sam Cáp",
        "type": "xa"
      },
      {
        "code": "6429",
        "name": "Xã Sì Lở Lầu",
        "type": "xa"
      },
      {
        "code": "7453",
        "name": "Xã Sìn Hồ",
        "type": "xa"
      },
      {
        "code": "5917",
        "name": "Xã Sin Suối Hồ",
        "type": "xa"
      },
      {
        "code": "4893",
        "name": "Xã Tả Lèng",
        "type": "xa"
      },
      {
        "code": "285",
        "name": "Xã Tà Tổng",
        "type": "xa"
      },
      {
        "code": "3869",
        "name": "Xã Tân Uyên",
        "type": "xa"
      },
      {
        "code": "2845",
        "name": "Xã Than Uyên",
        "type": "xa"
      },
      {
        "code": "797",
        "name": "Xã Thu Lũm",
        "type": "xa"
      },
      {
        "code": "7197",
        "name": "Xã Tủa Sín Chải",
        "type": "xa"
      }
    ]
  },
  {
    "code": "31",
    "name": "Lạng Sơn",
    "wards": [
      {
        "code": "16671",
        "name": "Phường Đông Kinh",
        "type": "phuong"
      },
      {
        "code": "16415",
        "name": "Phường Kỳ Lừa",
        "type": "phuong"
      },
      {
        "code": "16159",
        "name": "Phường Lương Văn Tri",
        "type": "phuong"
      },
      {
        "code": "15903",
        "name": "Phường Tam Thanh",
        "type": "phuong"
      },
      {
        "code": "15647",
        "name": "Xã Ba Sơn",
        "type": "xa"
      },
      {
        "code": "4895",
        "name": "Xã Bắc Sơn",
        "type": "xa"
      },
      {
        "code": "14367",
        "name": "Xã Bằng Mạc",
        "type": "xa"
      },
      {
        "code": "2847",
        "name": "Xã Bình Gia",
        "type": "xa"
      },
      {
        "code": "13087",
        "name": "Xã Cai Kinh",
        "type": "xa"
      },
      {
        "code": "15135",
        "name": "Xã Cao Lộc",
        "type": "xa"
      },
      {
        "code": "287",
        "name": "Xã Châu Sơn",
        "type": "xa"
      },
      {
        "code": "13343",
        "name": "Xã Chi Lăng",
        "type": "xa"
      },
      {
        "code": "13855",
        "name": "Xã Chiến Thắng",
        "type": "xa"
      },
      {
        "code": "15391",
        "name": "Xã Công Sơn",
        "type": "xa"
      },
      {
        "code": "6687",
        "name": "Xã Điềm He",
        "type": "xa"
      },
      {
        "code": "543",
        "name": "Xã Đình Lập",
        "type": "xa"
      },
      {
        "code": "1311",
        "name": "Xã Đoàn Kết",
        "type": "xa"
      },
      {
        "code": "14879",
        "name": "Xã Đồng Đăng",
        "type": "xa"
      },
      {
        "code": "3615",
        "name": "Xã Hoa Thám",
        "type": "xa"
      },
      {
        "code": "8223",
        "name": "Xã Hoàng Văn Thụ",
        "type": "xa"
      },
      {
        "code": "8991",
        "name": "Xã Hội Hoan",
        "type": "xa"
      },
      {
        "code": "3359",
        "name": "Xã Hồng Phong",
        "type": "xa"
      },
      {
        "code": "5151",
        "name": "Xã Hưng Vũ",
        "type": "xa"
      },
      {
        "code": "12831",
        "name": "Xã Hữu Liên",
        "type": "xa"
      },
      {
        "code": "11295",
        "name": "Xã Hữu Lũng",
        "type": "xa"
      },
      {
        "code": "2335",
        "name": "Xã Kháng Chiến",
        "type": "xa"
      },
      {
        "code": "7711",
        "name": "Xã Khánh Khê",
        "type": "xa"
      },
      {
        "code": "10783",
        "name": "Xã Khuất Xá",
        "type": "xa"
      },
      {
        "code": "799",
        "name": "Xã Kiên Mộc",
        "type": "xa"
      },
      {
        "code": "9247",
        "name": "Xã Lộc Bình",
        "type": "xa"
      },
      {
        "code": "10015",
        "name": "Xã Lợi Bác",
        "type": "xa"
      },
      {
        "code": "9503",
        "name": "Xã Mẫu Sơn",
        "type": "xa"
      },
      {
        "code": "9759",
        "name": "Xã Na Dương",
        "type": "xa"
      },
      {
        "code": "7967",
        "name": "Xã Na Sầm",
        "type": "xa"
      },
      {
        "code": "14111",
        "name": "Xã Nhân Lý",
        "type": "xa"
      },
      {
        "code": "5663",
        "name": "Xã Nhất Hòa",
        "type": "xa"
      },
      {
        "code": "13599",
        "name": "Xã Quan Sơn",
        "type": "xa"
      },
      {
        "code": "2079",
        "name": "Xã Quốc Khánh",
        "type": "xa"
      },
      {
        "code": "2591",
        "name": "Xã Quốc Việt",
        "type": "xa"
      },
      {
        "code": "3871",
        "name": "Xã Quý Hòa",
        "type": "xa"
      },
      {
        "code": "7455",
        "name": "Xã Tân Đoàn",
        "type": "xa"
      },
      {
        "code": "11807",
        "name": "Xã Tân Thành",
        "type": "xa"
      },
      {
        "code": "1567",
        "name": "Xã Tân Tiến",
        "type": "xa"
      },
      {
        "code": "6175",
        "name": "Xã Tân Tri",
        "type": "xa"
      },
      {
        "code": "3103",
        "name": "Xã Tân Văn",
        "type": "xa"
      },
      {
        "code": "11039",
        "name": "Xã Thái Bình",
        "type": "xa"
      },
      {
        "code": "1055",
        "name": "Xã Thất Khê",
        "type": "xa"
      },
      {
        "code": "4127",
        "name": "Xã Thiện Hòa",
        "type": "xa"
      },
      {
        "code": "4639",
        "name": "Xã Thiện Long",
        "type": "xa"
      },
      {
        "code": "12319",
        "name": "Xã Thiện Tân",
        "type": "xa"
      },
      {
        "code": "4383",
        "name": "Xã Thiện Thuật",
        "type": "xa"
      },
      {
        "code": "10271",
        "name": "Xã Thống Nhất",
        "type": "xa"
      },
      {
        "code": "8479",
        "name": "Xã Thụy Hùng",
        "type": "xa"
      },
      {
        "code": "1823",
        "name": "Xã Tràng Định",
        "type": "xa"
      },
      {
        "code": "7199",
        "name": "Xã Tri Lễ",
        "type": "xa"
      },
      {
        "code": "11551",
        "name": "Xã Tuấn Sơn",
        "type": "xa"
      },
      {
        "code": "14623",
        "name": "Xã Vạn Linh",
        "type": "xa"
      },
      {
        "code": "8735",
        "name": "Xã Văn Lãng",
        "type": "xa"
      },
      {
        "code": "6431",
        "name": "Xã Văn Quan",
        "type": "xa"
      },
      {
        "code": "12063",
        "name": "Xã Vân Nham",
        "type": "xa"
      },
      {
        "code": "5407",
        "name": "Xã Vũ Lăng",
        "type": "xa"
      },
      {
        "code": "5919",
        "name": "Xã Vũ Lễ",
        "type": "xa"
      },
      {
        "code": "10527",
        "name": "Xã Xuân Dương",
        "type": "xa"
      },
      {
        "code": "12575",
        "name": "Xã Yên Bình",
        "type": "xa"
      },
      {
        "code": "6943",
        "name": "Xã Yên Phúc",
        "type": "xa"
      }
    ]
  },
  {
    "code": "32",
    "name": "Lào Cai",
    "wards": [
      {
        "code": "12320",
        "name": "Phường Âu Lâu",
        "type": "phuong"
      },
      {
        "code": "15136",
        "name": "Phường Cam Đường",
        "type": "phuong"
      },
      {
        "code": "4640",
        "name": "Phường Cầu Thia",
        "type": "phuong"
      },
      {
        "code": "15392",
        "name": "Phường Lào Cai",
        "type": "phuong"
      },
      {
        "code": "12064",
        "name": "Phường Nam Cường",
        "type": "phuong"
      },
      {
        "code": "4128",
        "name": "Phường Nghĩa Lộ",
        "type": "phuong"
      },
      {
        "code": "21792",
        "name": "Phường Sa Pa",
        "type": "phuong"
      },
      {
        "code": "4384",
        "name": "Phường Trung Tâm",
        "type": "phuong"
      },
      {
        "code": "11552",
        "name": "Phường Văn Phú",
        "type": "phuong"
      },
      {
        "code": "11808",
        "name": "Phường Yên Bái",
        "type": "phuong"
      },
      {
        "code": "16928",
        "name": "Xã A Mú Sung",
        "type": "xa"
      },
      {
        "code": "21536",
        "name": "Xã Bản Hồ",
        "type": "xa"
      },
      {
        "code": "24608",
        "name": "Xã Bản Lầu",
        "type": "xa"
      },
      {
        "code": "23072",
        "name": "Xã Bản Liền",
        "type": "xa"
      },
      {
        "code": "17440",
        "name": "Xã Bản Xèo",
        "type": "xa"
      },
      {
        "code": "11296",
        "name": "Xã Bảo Ái",
        "type": "xa"
      },
      {
        "code": "19232",
        "name": "Xã Bảo Hà",
        "type": "xa"
      },
      {
        "code": "22816",
        "name": "Xã Bảo Nhai",
        "type": "xa"
      },
      {
        "code": "14368",
        "name": "Xã Bảo Thắng",
        "type": "xa"
      },
      {
        "code": "17952",
        "name": "Xã Bảo Yên",
        "type": "xa"
      },
      {
        "code": "17696",
        "name": "Xã Bát Xát",
        "type": "xa"
      },
      {
        "code": "23328",
        "name": "Xã Bắc Hà",
        "type": "xa"
      },
      {
        "code": "10272",
        "name": "Xã Cảm Nhân",
        "type": "xa"
      },
      {
        "code": "24864",
        "name": "Xã Cao Sơn",
        "type": "xa"
      },
      {
        "code": "1824",
        "name": "Xã Cát Thịnh",
        "type": "xa"
      },
      {
        "code": "6176",
        "name": "Xã Chấn Thịnh",
        "type": "xa"
      },
      {
        "code": "6944",
        "name": "Xã Châu Quế",
        "type": "xa"
      },
      {
        "code": "1312",
        "name": "Xã Chế Tạo",
        "type": "xa"
      },
      {
        "code": "20512",
        "name": "Xã Chiềng Ken",
        "type": "xa"
      },
      {
        "code": "22560",
        "name": "Xã Cốc Lầu",
        "type": "xa"
      },
      {
        "code": "15648",
        "name": "Xã Cốc San",
        "type": "xa"
      },
      {
        "code": "16416",
        "name": "Xã Dền Sáng",
        "type": "xa"
      },
      {
        "code": "20256",
        "name": "Xã Dương Quỳ",
        "type": "xa"
      },
      {
        "code": "7456",
        "name": "Xã Đông Cuông",
        "type": "xa"
      },
      {
        "code": "5152",
        "name": "Xã Gia Hội",
        "type": "xa"
      },
      {
        "code": "14880",
        "name": "Xã Gia Phú",
        "type": "xa"
      },
      {
        "code": "3360",
        "name": "Xã Hạnh Phúc",
        "type": "xa"
      },
      {
        "code": "15904",
        "name": "Xã Hợp Thành",
        "type": "xa"
      },
      {
        "code": "12832",
        "name": "Xã Hưng Khánh",
        "type": "xa"
      },
      {
        "code": "9504",
        "name": "Xã Khánh Hòa",
        "type": "xa"
      },
      {
        "code": "19744",
        "name": "Xã Khánh Yên",
        "type": "xa"
      },
      {
        "code": "2336",
        "name": "Xã Khao Mang",
        "type": "xa"
      },
      {
        "code": "1568",
        "name": "Xã Lao Chải",
        "type": "xa"
      },
      {
        "code": "7200",
        "name": "Xã Lâm Giang",
        "type": "xa"
      },
      {
        "code": "8736",
        "name": "Xã Lâm Thượng",
        "type": "xa"
      },
      {
        "code": "3872",
        "name": "Xã Liên Sơn",
        "type": "xa"
      },
      {
        "code": "8992",
        "name": "Xã Lục Yên",
        "type": "xa"
      },
      {
        "code": "23840",
        "name": "Xã Lùng Phình",
        "type": "xa"
      },
      {
        "code": "13088",
        "name": "Xã Lương Thịnh",
        "type": "xa"
      },
      {
        "code": "7968",
        "name": "Xã Mậu A",
        "type": "xa"
      },
      {
        "code": "20768",
        "name": "Xã Minh Lương",
        "type": "xa"
      },
      {
        "code": "8480",
        "name": "Xã Mỏ Vàng",
        "type": "xa"
      },
      {
        "code": "2592",
        "name": "Xã Mù Cang Chải",
        "type": "xa"
      },
      {
        "code": "21280",
        "name": "Xã Mường Bo",
        "type": "xa"
      },
      {
        "code": "16160",
        "name": "Xã Mường Hum",
        "type": "xa"
      },
      {
        "code": "24352",
        "name": "Xã Mường Khương",
        "type": "xa"
      },
      {
        "code": "10016",
        "name": "Xã Mường Lai",
        "type": "xa"
      },
      {
        "code": "21024",
        "name": "Xã Nậm Chày",
        "type": "xa"
      },
      {
        "code": "544",
        "name": "Xã Nậm Có",
        "type": "xa"
      },
      {
        "code": "800",
        "name": "Xã Nậm Xé",
        "type": "xa"
      },
      {
        "code": "18208",
        "name": "Xã Nghĩa Đô",
        "type": "xa"
      },
      {
        "code": "6432",
        "name": "Xã Nghĩa Tâm",
        "type": "xa"
      },
      {
        "code": "2080",
        "name": "Xã Ngũ Chỉ Sơn",
        "type": "xa"
      },
      {
        "code": "24096",
        "name": "Xã Pha Long",
        "type": "xa"
      },
      {
        "code": "3616",
        "name": "Xã Phình Hồ",
        "type": "xa"
      },
      {
        "code": "6688",
        "name": "Xã Phong Dụ Hạ",
        "type": "xa"
      },
      {
        "code": "288",
        "name": "Xã Phong Dụ Thượng",
        "type": "xa"
      },
      {
        "code": "13856",
        "name": "Xã Phong Hải",
        "type": "xa"
      },
      {
        "code": "18976",
        "name": "Xã Phúc Khánh",
        "type": "xa"
      },
      {
        "code": "9760",
        "name": "Xã Phúc Lợi",
        "type": "xa"
      },
      {
        "code": "2848",
        "name": "Xã Púng Luông",
        "type": "xa"
      },
      {
        "code": "13600",
        "name": "Xã Quy Mông",
        "type": "xa"
      },
      {
        "code": "25120",
        "name": "Xã Si Ma Cai",
        "type": "xa"
      },
      {
        "code": "25376",
        "name": "Xã Sín Chéng",
        "type": "xa"
      },
      {
        "code": "5408",
        "name": "Xã Sơn Lương",
        "type": "xa"
      },
      {
        "code": "23584",
        "name": "Xã Tả Củ Tỷ",
        "type": "xa"
      },
      {
        "code": "22048",
        "name": "Xã Tả Phìn",
        "type": "xa"
      },
      {
        "code": "22304",
        "name": "Xã Tả Van",
        "type": "xa"
      },
      {
        "code": "1056",
        "name": "Xã Tà Xi Láng",
        "type": "xa"
      },
      {
        "code": "14624",
        "name": "Xã Tằng Loỏng",
        "type": "xa"
      },
      {
        "code": "7712",
        "name": "Xã Tân Hợp",
        "type": "xa"
      },
      {
        "code": "9248",
        "name": "Xã Tân Lĩnh",
        "type": "xa"
      },
      {
        "code": "10784",
        "name": "Xã Thác Bà",
        "type": "xa"
      },
      {
        "code": "5920",
        "name": "Xã Thượng Bằng La",
        "type": "xa"
      },
      {
        "code": "18464",
        "name": "Xã Thượng Hà",
        "type": "xa"
      },
      {
        "code": "3104",
        "name": "Xã Trạm Tấu",
        "type": "xa"
      },
      {
        "code": "12576",
        "name": "Xã Trấn Yên",
        "type": "xa"
      },
      {
        "code": "17184",
        "name": "Xã Trịnh Tường",
        "type": "xa"
      },
      {
        "code": "4896",
        "name": "Xã Tú Lệ",
        "type": "xa"
      },
      {
        "code": "20000",
        "name": "Xã Văn Bàn",
        "type": "xa"
      },
      {
        "code": "5664",
        "name": "Xã Văn Chấn",
        "type": "xa"
      },
      {
        "code": "13344",
        "name": "Xã Việt Hồng",
        "type": "xa"
      },
      {
        "code": "19488",
        "name": "Xã Võ Lao",
        "type": "xa"
      },
      {
        "code": "8224",
        "name": "Xã Xuân Ái",
        "type": "xa"
      },
      {
        "code": "18720",
        "name": "Xã Xuân Hòa",
        "type": "xa"
      },
      {
        "code": "14112",
        "name": "Xã Xuân Quang",
        "type": "xa"
      },
      {
        "code": "16672",
        "name": "Xã Y Tý",
        "type": "xa"
      },
      {
        "code": "11040",
        "name": "Xã Yên Bình",
        "type": "xa"
      },
      {
        "code": "10528",
        "name": "Xã Yên Thành",
        "type": "xa"
      }
    ]
  },
  {
    "code": "30",
    "name": "Lâm Đồng",
    "wards": [
      {
        "code": "2078",
        "name": "Đặc Khu Phú Quý",
        "type": "dac-khu"
      },
      {
        "code": "4126",
        "name": "Phường 1 Bảo Lộc",
        "type": "phuong"
      },
      {
        "code": "4382",
        "name": "Phường 2 Bảo Lộc",
        "type": "phuong"
      },
      {
        "code": "4638",
        "name": "Phường 3 Bảo Lộc",
        "type": "phuong"
      },
      {
        "code": "4894",
        "name": "Phường B'Lao",
        "type": "phuong"
      },
      {
        "code": "19742",
        "name": "Phường Bắc Gia Nghĩa",
        "type": "phuong"
      },
      {
        "code": "29470",
        "name": "Phường Bình Thuận",
        "type": "phuong"
      },
      {
        "code": "3102",
        "name": "Phường Cam Ly-Đà Lạt",
        "type": "phuong"
      },
      {
        "code": "20254",
        "name": "Phường Đông Gia Nghĩa",
        "type": "phuong"
      },
      {
        "code": "29214",
        "name": "Phường Hàm Thắng",
        "type": "phuong"
      },
      {
        "code": "24862",
        "name": "Phường La Gi",
        "type": "phuong"
      },
      {
        "code": "3870",
        "name": "Phường Lang Biang-Đà Lạt",
        "type": "phuong"
      },
      {
        "code": "3358",
        "name": "Phường Lâm Viên-Đà Lạt",
        "type": "phuong"
      },
      {
        "code": "29726",
        "name": "Phường Mũi Né",
        "type": "phuong"
      },
      {
        "code": "19998",
        "name": "Phường Nam Gia Nghĩa",
        "type": "phuong"
      },
      {
        "code": "30238",
        "name": "Phường Phan Thiết",
        "type": "phuong"
      },
      {
        "code": "29982",
        "name": "Phường Phú Thủy",
        "type": "phuong"
      },
      {
        "code": "25118",
        "name": "Phường Phước Hội",
        "type": "phuong"
      },
      {
        "code": "30494",
        "name": "Phường Tiến Thành",
        "type": "phuong"
      },
      {
        "code": "2846",
        "name": "Phường Xuân Hương-Đà Lạt",
        "type": "phuong"
      },
      {
        "code": "3614",
        "name": "Phường Xuân Trường-Đà Lạt",
        "type": "phuong"
      },
      {
        "code": "12062",
        "name": "Xã Bảo Lâm 1",
        "type": "xa"
      },
      {
        "code": "12318",
        "name": "Xã Bảo Lâm 2",
        "type": "xa"
      },
      {
        "code": "12574",
        "name": "Xã Bảo Lâm 3",
        "type": "xa"
      },
      {
        "code": "12830",
        "name": "Xã Bảo Lâm 4",
        "type": "xa"
      },
      {
        "code": "13086",
        "name": "Xã Bảo Lâm 5",
        "type": "xa"
      },
      {
        "code": "11294",
        "name": "Xã Bảo Thuận",
        "type": "xa"
      },
      {
        "code": "22302",
        "name": "Xã Bắc Bình",
        "type": "xa"
      },
      {
        "code": "25886",
        "name": "Xã Bắc Ruộng",
        "type": "xa"
      },
      {
        "code": "14622",
        "name": "Xã Cát Tiên",
        "type": "xa"
      },
      {
        "code": "14878",
        "name": "Xã Cát Tiên 2",
        "type": "xa"
      },
      {
        "code": "15134",
        "name": "Xã Cát Tiên 3",
        "type": "xa"
      },
      {
        "code": "15902",
        "name": "Xã Cư Jút",
        "type": "xa"
      },
      {
        "code": "5918",
        "name": "Xã D'Ran",
        "type": "xa"
      },
      {
        "code": "10270",
        "name": "Xã Di Linh",
        "type": "xa"
      },
      {
        "code": "13342",
        "name": "Xã Đạ Huoai",
        "type": "xa"
      },
      {
        "code": "13598",
        "name": "Xã Đạ Huoai 2",
        "type": "xa"
      },
      {
        "code": "2590",
        "name": "Xã Đạ Huoai 3",
        "type": "xa"
      },
      {
        "code": "13854",
        "name": "Xã Đạ Tẻh",
        "type": "xa"
      },
      {
        "code": "14110",
        "name": "Xã Đạ Tẻh 2",
        "type": "xa"
      },
      {
        "code": "14366",
        "name": "Xã Đạ Tẻh 3",
        "type": "xa"
      },
      {
        "code": "9246",
        "name": "Xã Đam Rông 1",
        "type": "xa"
      },
      {
        "code": "9502",
        "name": "Xã Đam Rông 2",
        "type": "xa"
      },
      {
        "code": "9758",
        "name": "Xã Đam Rông 3",
        "type": "xa"
      },
      {
        "code": "10014",
        "name": "Xã Đam Rông 4",
        "type": "xa"
      },
      {
        "code": "16670",
        "name": "Xã Đắk Mil",
        "type": "xa"
      },
      {
        "code": "16926",
        "name": "Xã Đắk Sắk",
        "type": "xa"
      },
      {
        "code": "18206",
        "name": "Xã Đắk Song",
        "type": "xa"
      },
      {
        "code": "15390",
        "name": "Xã Đắk Wil",
        "type": "xa"
      },
      {
        "code": "11038",
        "name": "Xã Đinh Trang Thượng",
        "type": "xa"
      },
      {
        "code": "7710",
        "name": "Xã Đinh Văn Lâm Hà",
        "type": "xa"
      },
      {
        "code": "23582",
        "name": "Xã Đông Giang",
        "type": "xa"
      },
      {
        "code": "26142",
        "name": "Xã Đồng Kho",
        "type": "xa"
      },
      {
        "code": "5150",
        "name": "Xã Đơn Dương",
        "type": "xa"
      },
      {
        "code": "18462",
        "name": "Xã Đức An",
        "type": "xa"
      },
      {
        "code": "16414",
        "name": "Xã Đức Lập",
        "type": "xa"
      },
      {
        "code": "27166",
        "name": "Xã Đức Linh",
        "type": "xa"
      },
      {
        "code": "6686",
        "name": "Xã Đức Trọng",
        "type": "xa"
      },
      {
        "code": "11806",
        "name": "Xã Gia Hiệp",
        "type": "xa"
      },
      {
        "code": "22558",
        "name": "Xã Hải Ninh",
        "type": "xa"
      },
      {
        "code": "31262",
        "name": "Xã Hàm Kiệm",
        "type": "xa"
      },
      {
        "code": "28958",
        "name": "Xã Hàm Liêm",
        "type": "xa"
      },
      {
        "code": "24350",
        "name": "Xã Hàm Tân",
        "type": "xa"
      },
      {
        "code": "31006",
        "name": "Xã Hàm Thạnh",
        "type": "xa"
      },
      {
        "code": "28446",
        "name": "Xã Hàm Thuận",
        "type": "xa"
      },
      {
        "code": "28190",
        "name": "Xã Hàm Thuận Bắc",
        "type": "xa"
      },
      {
        "code": "31774",
        "name": "Xã Hàm Thuận Nam",
        "type": "xa"
      },
      {
        "code": "6174",
        "name": "Xã Hiệp Thạnh",
        "type": "xa"
      },
      {
        "code": "10782",
        "name": "Xã Hòa Bắc",
        "type": "xa"
      },
      {
        "code": "10526",
        "name": "Xã Hòa Ninh",
        "type": "xa"
      },
      {
        "code": "1822",
        "name": "Xã Hòa Thắng",
        "type": "xa"
      },
      {
        "code": "27422",
        "name": "Xã Hoài Đức",
        "type": "xa"
      },
      {
        "code": "28702",
        "name": "Xã Hồng Sơn",
        "type": "xa"
      },
      {
        "code": "2334",
        "name": "Xã Hồng Thái",
        "type": "xa"
      },
      {
        "code": "5406",
        "name": "Xã Ka Đô",
        "type": "xa"
      },
      {
        "code": "21022",
        "name": "Xã Kiến Đức",
        "type": "xa"
      },
      {
        "code": "17438",
        "name": "Xã Krông Nô",
        "type": "xa"
      },
      {
        "code": "27934",
        "name": "Xã La Dạ",
        "type": "xa"
      },
      {
        "code": "6430",
        "name": "Xã Lạc Dương",
        "type": "xa"
      },
      {
        "code": "22046",
        "name": "Xã Liên Hương",
        "type": "xa"
      },
      {
        "code": "23326",
        "name": "Xã Lương Sơn",
        "type": "xa"
      },
      {
        "code": "8478",
        "name": "Xã Nam Ban Lâm Hà",
        "type": "xa"
      },
      {
        "code": "15646",
        "name": "Xã Nam Dong",
        "type": "xa"
      },
      {
        "code": "17182",
        "name": "Xã Nam Đà",
        "type": "xa"
      },
      {
        "code": "8222",
        "name": "Xã Nam Hà Lâm Hà",
        "type": "xa"
      },
      {
        "code": "26910",
        "name": "Xã Nam Thành",
        "type": "xa"
      },
      {
        "code": "17694",
        "name": "Xã Nâm Nung",
        "type": "xa"
      },
      {
        "code": "25630",
        "name": "Xã Nghị Đức",
        "type": "xa"
      },
      {
        "code": "21278",
        "name": "Xã Nhân Cơ",
        "type": "xa"
      },
      {
        "code": "1054",
        "name": "Xã Ninh Gia",
        "type": "xa"
      },
      {
        "code": "1310",
        "name": "Xã Phan Rí Cửa",
        "type": "xa"
      },
      {
        "code": "22814",
        "name": "Xã Phan Sơn",
        "type": "xa"
      },
      {
        "code": "7966",
        "name": "Xã Phú Sơn Lâm Hà",
        "type": "xa"
      },
      {
        "code": "8990",
        "name": "Xã Phúc Thọ Lâm Hà",
        "type": "xa"
      },
      {
        "code": "286",
        "name": "Xã Quảng Hòa",
        "type": "xa"
      },
      {
        "code": "19486",
        "name": "Xã Quảng Khê",
        "type": "xa"
      },
      {
        "code": "5662",
        "name": "Xã Quảng Lập",
        "type": "xa"
      },
      {
        "code": "17950",
        "name": "Xã Quảng Phú",
        "type": "xa"
      },
      {
        "code": "542",
        "name": "Xã Quảng Sơn",
        "type": "xa"
      },
      {
        "code": "20510",
        "name": "Xã Quảng Tân",
        "type": "xa"
      },
      {
        "code": "21534",
        "name": "Xã Quảng Tín",
        "type": "xa"
      },
      {
        "code": "798",
        "name": "Xã Quảng Trực",
        "type": "xa"
      },
      {
        "code": "23070",
        "name": "Xã Sông Lũy",
        "type": "xa"
      },
      {
        "code": "11550",
        "name": "Xã Sơn Điền",
        "type": "xa"
      },
      {
        "code": "24606",
        "name": "Xã Sơn Mỹ",
        "type": "xa"
      },
      {
        "code": "26654",
        "name": "Xã Suối Kiết",
        "type": "xa"
      },
      {
        "code": "19230",
        "name": "Xã Tà Đùng",
        "type": "xa"
      },
      {
        "code": "7198",
        "name": "Xã Tà Hine",
        "type": "xa"
      },
      {
        "code": "7454",
        "name": "Xã Tà Năng",
        "type": "xa"
      },
      {
        "code": "26398",
        "name": "Xã Tánh Linh",
        "type": "xa"
      },
      {
        "code": "8734",
        "name": "Xã Tân Hà Lâm Hà",
        "type": "xa"
      },
      {
        "code": "25374",
        "name": "Xã Tân Hải",
        "type": "xa"
      },
      {
        "code": "6942",
        "name": "Xã Tân Hội",
        "type": "xa"
      },
      {
        "code": "23838",
        "name": "Xã Tân Lập",
        "type": "xa"
      },
      {
        "code": "24094",
        "name": "Xã Tân Minh",
        "type": "xa"
      },
      {
        "code": "31518",
        "name": "Xã Tân Thành",
        "type": "xa"
      },
      {
        "code": "16158",
        "name": "Xã Thuận An",
        "type": "xa"
      },
      {
        "code": "18718",
        "name": "Xã Thuận Hạnh",
        "type": "xa"
      },
      {
        "code": "27678",
        "name": "Xã Trà Tân",
        "type": "xa"
      },
      {
        "code": "18974",
        "name": "Xã Trường Xuân",
        "type": "xa"
      },
      {
        "code": "20766",
        "name": "Xã Tuy Đức",
        "type": "xa"
      },
      {
        "code": "1566",
        "name": "Xã Tuy Phong",
        "type": "xa"
      },
      {
        "code": "30750",
        "name": "Xã Tuyên Quang",
        "type": "xa"
      },
      {
        "code": "21790",
        "name": "Xã Vĩnh Hảo",
        "type": "xa"
      }
    ]
  },
  {
    "code": "33",
    "name": "Nghệ An",
    "wards": [
      {
        "code": "32801",
        "name": "Phường Cửa Lò",
        "type": "phuong"
      },
      {
        "code": "9249",
        "name": "Phường Hoàng Mai",
        "type": "phuong"
      },
      {
        "code": "9761",
        "name": "Phường Quỳnh Mai",
        "type": "phuong"
      },
      {
        "code": "9505",
        "name": "Phường Tân Mai",
        "type": "phuong"
      },
      {
        "code": "26913",
        "name": "Phường Tây Hiếu",
        "type": "phuong"
      },
      {
        "code": "26657",
        "name": "Phường Thái Hòa",
        "type": "phuong"
      },
      {
        "code": "29217",
        "name": "Phường Thành Vinh",
        "type": "phuong"
      },
      {
        "code": "33313",
        "name": "Phường Trường Vinh",
        "type": "phuong"
      },
      {
        "code": "29473",
        "name": "Phường Vinh Hưng",
        "type": "phuong"
      },
      {
        "code": "29985",
        "name": "Phường Vinh Lộc",
        "type": "phuong"
      },
      {
        "code": "29729",
        "name": "Phường Vinh Phú",
        "type": "phuong"
      },
      {
        "code": "6945",
        "name": "Xã An Châu",
        "type": "xa"
      },
      {
        "code": "2849",
        "name": "Xã Anh Sơn",
        "type": "xa"
      },
      {
        "code": "3617",
        "name": "Xã Anh Sơn Đông",
        "type": "xa"
      },
      {
        "code": "8481",
        "name": "Xã Bạch Hà",
        "type": "xa"
      },
      {
        "code": "7969",
        "name": "Xã Bạch Ngọc",
        "type": "xa"
      },
      {
        "code": "801",
        "name": "Xã Bắc Lý",
        "type": "xa"
      },
      {
        "code": "25889",
        "name": "Xã Bích Hào",
        "type": "xa"
      },
      {
        "code": "1825",
        "name": "Xã Bình Chuẩn",
        "type": "xa"
      },
      {
        "code": "32033",
        "name": "Xã Bình Minh",
        "type": "xa"
      },
      {
        "code": "5153",
        "name": "Xã Cam Phục",
        "type": "xa"
      },
      {
        "code": "24353",
        "name": "Xã Cát Ngạn",
        "type": "xa"
      },
      {
        "code": "2081",
        "name": "Xã Châu Bình",
        "type": "xa"
      },
      {
        "code": "20001",
        "name": "Xã Châu Hồng",
        "type": "xa"
      },
      {
        "code": "5409",
        "name": "Xã Châu Khê",
        "type": "xa"
      },
      {
        "code": "19745",
        "name": "Xã Châu Lộc",
        "type": "xa"
      },
      {
        "code": "18721",
        "name": "Xã Châu Tiến",
        "type": "xa"
      },
      {
        "code": "11553",
        "name": "Xã Chiêu Lưu",
        "type": "xa"
      },
      {
        "code": "4385",
        "name": "Xã Con Cuông",
        "type": "xa"
      },
      {
        "code": "5665",
        "name": "Xã Diễn Châu",
        "type": "xa"
      },
      {
        "code": "26145",
        "name": "Xã Đại Đồng",
        "type": "xa"
      },
      {
        "code": "13089",
        "name": "Xã Đại Huệ",
        "type": "xa"
      },
      {
        "code": "7713",
        "name": "Xã Đô Lương",
        "type": "xa"
      },
      {
        "code": "27169",
        "name": "Xã Đông Hiếu",
        "type": "xa"
      },
      {
        "code": "16161",
        "name": "Xã Đông Lộc",
        "type": "xa"
      },
      {
        "code": "32289",
        "name": "Xã Đông Thành",
        "type": "xa"
      },
      {
        "code": "5921",
        "name": "Xã Đức Châu",
        "type": "xa"
      },
      {
        "code": "31777",
        "name": "Xã Giai Lạc",
        "type": "xa"
      },
      {
        "code": "23585",
        "name": "Xã Giai Xuân",
        "type": "xa"
      },
      {
        "code": "6433",
        "name": "Xã Hải Châu",
        "type": "xa"
      },
      {
        "code": "16929",
        "name": "Xã Hải Lộc",
        "type": "xa"
      },
      {
        "code": "24865",
        "name": "Xã Hạnh Lâm",
        "type": "xa"
      },
      {
        "code": "25377",
        "name": "Xã Hoa Quân",
        "type": "xa"
      },
      {
        "code": "30753",
        "name": "Xã Hợp Minh",
        "type": "xa"
      },
      {
        "code": "18977",
        "name": "Xã Hùng Chân",
        "type": "xa"
      },
      {
        "code": "7457",
        "name": "Xã Hùng Châu",
        "type": "xa"
      },
      {
        "code": "545",
        "name": "Xã Huồi Tụ",
        "type": "xa"
      },
      {
        "code": "10017",
        "name": "Xã Hưng Nguyên",
        "type": "xa"
      },
      {
        "code": "10273",
        "name": "Xã Hưng Nguyên Nam",
        "type": "xa"
      },
      {
        "code": "289",
        "name": "Xã Hữu Khuông",
        "type": "xa"
      },
      {
        "code": "11041",
        "name": "Xã Hữu Kiệm",
        "type": "xa"
      },
      {
        "code": "1057",
        "name": "Xã Keng Đu",
        "type": "xa"
      },
      {
        "code": "25633",
        "name": "Xã Kim Bảng",
        "type": "xa"
      },
      {
        "code": "13601",
        "name": "Xã Kim Liên",
        "type": "xa"
      },
      {
        "code": "10529",
        "name": "Xã Lam Thành",
        "type": "xa"
      },
      {
        "code": "2337",
        "name": "Xã Lượng Minh",
        "type": "xa"
      },
      {
        "code": "8993",
        "name": "Xã Lương Sơn",
        "type": "xa"
      },
      {
        "code": "4897",
        "name": "Xã Mậu Thạch",
        "type": "xa"
      },
      {
        "code": "7201",
        "name": "Xã Minh Châu",
        "type": "xa"
      },
      {
        "code": "20769",
        "name": "Xã Minh Hợp",
        "type": "xa"
      },
      {
        "code": "4641",
        "name": "Xã Môn Sơn",
        "type": "xa"
      },
      {
        "code": "20513",
        "name": "Xã Mường Chọng",
        "type": "xa"
      },
      {
        "code": "20257",
        "name": "Xã Mường Ham",
        "type": "xa"
      },
      {
        "code": "1313",
        "name": "Xã Mường Lống",
        "type": "xa"
      },
      {
        "code": "17953",
        "name": "Xã Mường Quàng",
        "type": "xa"
      },
      {
        "code": "12065",
        "name": "Xã Mường Típ",
        "type": "xa"
      },
      {
        "code": "10785",
        "name": "Xã Mường Xén",
        "type": "xa"
      },
      {
        "code": "1569",
        "name": "Xã Mỹ Lý",
        "type": "xa"
      },
      {
        "code": "11809",
        "name": "Xã Na Loi",
        "type": "xa"
      },
      {
        "code": "12321",
        "name": "Xã Na Ngoi",
        "type": "xa"
      },
      {
        "code": "12833",
        "name": "Xã Nam Đàn",
        "type": "xa"
      },
      {
        "code": "11297",
        "name": "Xã Nậm Cắn",
        "type": "xa"
      },
      {
        "code": "28705",
        "name": "Xã Nga My",
        "type": "xa"
      },
      {
        "code": "15649",
        "name": "Xã Nghi Lộc",
        "type": "xa"
      },
      {
        "code": "13857",
        "name": "Xã Nghĩa Đàn",
        "type": "xa"
      },
      {
        "code": "23329",
        "name": "Xã Nghĩa Đồng",
        "type": "xa"
      },
      {
        "code": "23841",
        "name": "Xã Nghĩa Hành",
        "type": "xa"
      },
      {
        "code": "14881",
        "name": "Xã Nghĩa Hưng",
        "type": "xa"
      },
      {
        "code": "15137",
        "name": "Xã Nghĩa Khánh",
        "type": "xa"
      },
      {
        "code": "14369",
        "name": "Xã Nghĩa Lâm",
        "type": "xa"
      },
      {
        "code": "15393",
        "name": "Xã Nghĩa Lộc",
        "type": "xa"
      },
      {
        "code": "14625",
        "name": "Xã Nghĩa Mai",
        "type": "xa"
      },
      {
        "code": "14113",
        "name": "Xã Nghĩa Thọ",
        "type": "xa"
      },
      {
        "code": "3361",
        "name": "Xã Nhân Hòa",
        "type": "xa"
      },
      {
        "code": "28961",
        "name": "Xã Nhôn Mai",
        "type": "xa"
      },
      {
        "code": "15905",
        "name": "Xã Phúc Lộc",
        "type": "xa"
      },
      {
        "code": "30497",
        "name": "Xã Quan Thành",
        "type": "xa"
      },
      {
        "code": "6177",
        "name": "Xã Quảng Châu",
        "type": "xa"
      },
      {
        "code": "31521",
        "name": "Xã Quang Đồng",
        "type": "xa"
      },
      {
        "code": "33057",
        "name": "Xã Quế Phong",
        "type": "xa"
      },
      {
        "code": "18465",
        "name": "Xã Quỳ Châu",
        "type": "xa"
      },
      {
        "code": "19233",
        "name": "Xã Quỳ Hợp",
        "type": "xa"
      },
      {
        "code": "2593",
        "name": "Xã Quỳnh Anh",
        "type": "xa"
      },
      {
        "code": "21025",
        "name": "Xã Quỳnh Lưu",
        "type": "xa"
      },
      {
        "code": "21793",
        "name": "Xã Quỳnh Phú",
        "type": "xa"
      },
      {
        "code": "22049",
        "name": "Xã Quỳnh Sơn",
        "type": "xa"
      },
      {
        "code": "21537",
        "name": "Xã Quỳnh Tam",
        "type": "xa"
      },
      {
        "code": "22305",
        "name": "Xã Quỳnh Thắng",
        "type": "xa"
      },
      {
        "code": "21281",
        "name": "Xã Quỳnh Văn",
        "type": "xa"
      },
      {
        "code": "25121",
        "name": "Xã Sơn Lâm",
        "type": "xa"
      },
      {
        "code": "24609",
        "name": "Xã Tam Đồng",
        "type": "xa"
      },
      {
        "code": "19489",
        "name": "Xã Tam Hợp",
        "type": "xa"
      },
      {
        "code": "27425",
        "name": "Xã Tam Quang",
        "type": "xa"
      },
      {
        "code": "27681",
        "name": "Xã Tam Thái",
        "type": "xa"
      },
      {
        "code": "23073",
        "name": "Xã Tân An",
        "type": "xa"
      },
      {
        "code": "6689",
        "name": "Xã Tân Châu",
        "type": "xa"
      },
      {
        "code": "22561",
        "name": "Xã Tân Kỳ",
        "type": "xa"
      },
      {
        "code": "22817",
        "name": "Xã Tân Phú",
        "type": "xa"
      },
      {
        "code": "4129",
        "name": "Xã Thành Bình Thọ",
        "type": "xa"
      },
      {
        "code": "16673",
        "name": "Xã Thần Lĩnh",
        "type": "xa"
      },
      {
        "code": "13345",
        "name": "Xã Thiên Nhẫn",
        "type": "xa"
      },
      {
        "code": "18209",
        "name": "Xã Thông Thụ",
        "type": "xa"
      },
      {
        "code": "8737",
        "name": "Xã Thuần Trung",
        "type": "xa"
      },
      {
        "code": "24097",
        "name": "Xã Tiên Đồng",
        "type": "xa"
      },
      {
        "code": "17441",
        "name": "Xã Tiền Phong",
        "type": "xa"
      },
      {
        "code": "17697",
        "name": "Xã Tri Lễ",
        "type": "xa"
      },
      {
        "code": "16417",
        "name": "Xã Trung Lộc",
        "type": "xa"
      },
      {
        "code": "27937",
        "name": "Xã Tương Dương",
        "type": "xa"
      },
      {
        "code": "12577",
        "name": "Xã Vạn An",
        "type": "xa"
      },
      {
        "code": "8225",
        "name": "Xã Văn Hiến",
        "type": "xa"
      },
      {
        "code": "17185",
        "name": "Xã Văn Kiều",
        "type": "xa"
      },
      {
        "code": "31265",
        "name": "Xã Vân Du",
        "type": "xa"
      },
      {
        "code": "31009",
        "name": "Xã Vân Tụ",
        "type": "xa"
      },
      {
        "code": "3873",
        "name": "Xã Vĩnh Tường",
        "type": "xa"
      },
      {
        "code": "26401",
        "name": "Xã Xuân Lâm",
        "type": "xa"
      },
      {
        "code": "28449",
        "name": "Xã Yên Hòa",
        "type": "xa"
      },
      {
        "code": "28193",
        "name": "Xã Yên Na",
        "type": "xa"
      },
      {
        "code": "30241",
        "name": "Xã Yên Thành",
        "type": "xa"
      },
      {
        "code": "32545",
        "name": "Xã Yên Trung",
        "type": "xa"
      },
      {
        "code": "3105",
        "name": "Xã Yên Xuân",
        "type": "xa"
      }
    ]
  },
  {
    "code": "34",
    "name": "Ninh Bình",
    "wards": [
      {
        "code": "28194",
        "name": "Phường Châu Sơn",
        "type": "phuong"
      },
      {
        "code": "546",
        "name": "Phường Duy Hà",
        "type": "phuong"
      },
      {
        "code": "290",
        "name": "Phường Duy Tân",
        "type": "phuong"
      },
      {
        "code": "32802",
        "name": "Phường Duy Tiên",
        "type": "phuong"
      },
      {
        "code": "12578",
        "name": "Phường Đông A",
        "type": "phuong"
      },
      {
        "code": "2850",
        "name": "Phường Đông Hoa Lư",
        "type": "phuong"
      },
      {
        "code": "26402",
        "name": "Phường Đồng Văn",
        "type": "phuong"
      },
      {
        "code": "1570",
        "name": "Phường Hà Nam",
        "type": "phuong"
      },
      {
        "code": "2338",
        "name": "Phường Hoa Lư",
        "type": "phuong"
      },
      {
        "code": "13346",
        "name": "Phường Hồng Quang",
        "type": "phuong"
      },
      {
        "code": "32546",
        "name": "Phường Kim Bảng",
        "type": "phuong"
      },
      {
        "code": "27426",
        "name": "Phường Kim Thanh",
        "type": "phuong"
      },
      {
        "code": "26658",
        "name": "Phường Lê Hồ",
        "type": "phuong"
      },
      {
        "code": "28450",
        "name": "Phường Liêm Tuyền",
        "type": "phuong"
      },
      {
        "code": "27170",
        "name": "Phường Lý Thường Kiệt",
        "type": "phuong"
      },
      {
        "code": "2082",
        "name": "Phường Mỹ Lộc",
        "type": "phuong"
      },
      {
        "code": "12066",
        "name": "Phường Nam Định",
        "type": "phuong"
      },
      {
        "code": "2594",
        "name": "Phường Nam Hoa Lư",
        "type": "phuong"
      },
      {
        "code": "26914",
        "name": "Phường Nguyễn Úy",
        "type": "phuong"
      },
      {
        "code": "33058",
        "name": "Phường Phủ Lý",
        "type": "phuong"
      },
      {
        "code": "27938",
        "name": "Phường Phù Vân",
        "type": "phuong"
      },
      {
        "code": "27682",
        "name": "Phường Tam Chúc",
        "type": "phuong"
      },
      {
        "code": "3106",
        "name": "Phường Tam Điệp",
        "type": "phuong"
      },
      {
        "code": "802",
        "name": "Phường Tây Hoa Lư",
        "type": "phuong"
      },
      {
        "code": "12834",
        "name": "Phường Thành Nam",
        "type": "phuong"
      },
      {
        "code": "12322",
        "name": "Phường Thiên Trường",
        "type": "phuong"
      },
      {
        "code": "1826",
        "name": "Phường Tiên Sơn",
        "type": "phuong"
      },
      {
        "code": "3618",
        "name": "Phường Trung Sơn",
        "type": "phuong"
      },
      {
        "code": "13090",
        "name": "Phường Trường Thi",
        "type": "phuong"
      },
      {
        "code": "24354",
        "name": "Phường Vị Khê",
        "type": "phuong"
      },
      {
        "code": "3362",
        "name": "Phường Yên Sơn",
        "type": "phuong"
      },
      {
        "code": "3874",
        "name": "Phường Yên Thắng",
        "type": "phuong"
      },
      {
        "code": "31266",
        "name": "Xã Bắc Lý",
        "type": "xa"
      },
      {
        "code": "29218",
        "name": "Xã Bình An",
        "type": "xa"
      },
      {
        "code": "29474",
        "name": "Xã Bình Giang",
        "type": "xa"
      },
      {
        "code": "28706",
        "name": "Xã Bình Lục",
        "type": "xa"
      },
      {
        "code": "11554",
        "name": "Xã Bình Minh",
        "type": "xa"
      },
      {
        "code": "28962",
        "name": "Xã Bình Mỹ",
        "type": "xa"
      },
      {
        "code": "29730",
        "name": "Xã Bình Sơn",
        "type": "xa"
      },
      {
        "code": "18210",
        "name": "Xã Cát Thành",
        "type": "xa"
      },
      {
        "code": "10018",
        "name": "Xã Chất Bình",
        "type": "xa"
      },
      {
        "code": "17698",
        "name": "Xã Cổ Lễ",
        "type": "xa"
      },
      {
        "code": "6690",
        "name": "Xã Cúc Phương",
        "type": "xa"
      },
      {
        "code": "4386",
        "name": "Xã Đại Hoàng",
        "type": "xa"
      },
      {
        "code": "11298",
        "name": "Xã Định Hóa",
        "type": "xa"
      },
      {
        "code": "9762",
        "name": "Xã Đồng Thái",
        "type": "xa"
      },
      {
        "code": "22562",
        "name": "Xã Đồng Thịnh",
        "type": "xa"
      },
      {
        "code": "4642",
        "name": "Xã Gia Hưng",
        "type": "xa"
      },
      {
        "code": "5922",
        "name": "Xã Gia Lâm",
        "type": "xa"
      },
      {
        "code": "4898",
        "name": "Xã Gia Phong",
        "type": "xa"
      },
      {
        "code": "5410",
        "name": "Xã Gia Trấn",
        "type": "xa"
      },
      {
        "code": "6178",
        "name": "Xã Gia Tường",
        "type": "xa"
      },
      {
        "code": "5154",
        "name": "Xã Gia Vân",
        "type": "xa"
      },
      {
        "code": "4130",
        "name": "Xã Gia Viễn",
        "type": "xa"
      },
      {
        "code": "25890",
        "name": "Xã Giao Bình",
        "type": "xa"
      },
      {
        "code": "24866",
        "name": "Xã Giao Hòa",
        "type": "xa"
      },
      {
        "code": "25634",
        "name": "Xã Giao Hưng",
        "type": "xa"
      },
      {
        "code": "24610",
        "name": "Xã Giao Minh",
        "type": "xa"
      },
      {
        "code": "26146",
        "name": "Xã Giao Ninh",
        "type": "xa"
      },
      {
        "code": "25378",
        "name": "Xã Giao Phúc",
        "type": "xa"
      },
      {
        "code": "25122",
        "name": "Xã Giao Thủy",
        "type": "xa"
      },
      {
        "code": "21538",
        "name": "Xã Hải An",
        "type": "xa"
      },
      {
        "code": "20770",
        "name": "Xã Hải Anh",
        "type": "xa"
      },
      {
        "code": "20514",
        "name": "Xã Hải Hậu",
        "type": "xa"
      },
      {
        "code": "21282",
        "name": "Xã Hải Hưng",
        "type": "xa"
      },
      {
        "code": "21794",
        "name": "Xã Hải Quang",
        "type": "xa"
      },
      {
        "code": "22306",
        "name": "Xã Hải Thịnh",
        "type": "xa"
      },
      {
        "code": "21026",
        "name": "Xã Hải Tiến",
        "type": "xa"
      },
      {
        "code": "22050",
        "name": "Xã Hải Xuân",
        "type": "xa"
      },
      {
        "code": "15138",
        "name": "Xã Hiển Khánh",
        "type": "xa"
      },
      {
        "code": "23330",
        "name": "Xã Hồng Phong",
        "type": "xa"
      },
      {
        "code": "8482",
        "name": "Xã Khánh Hội",
        "type": "xa"
      },
      {
        "code": "7970",
        "name": "Xã Khánh Nhạc",
        "type": "xa"
      },
      {
        "code": "8226",
        "name": "Xã Khánh Thiện",
        "type": "xa"
      },
      {
        "code": "8738",
        "name": "Xã Khánh Trung",
        "type": "xa"
      },
      {
        "code": "11810",
        "name": "Xã Kim Đông",
        "type": "xa"
      },
      {
        "code": "10274",
        "name": "Xã Kim Sơn",
        "type": "xa"
      },
      {
        "code": "11042",
        "name": "Xã Lai Thành",
        "type": "xa"
      },
      {
        "code": "29986",
        "name": "Xã Liêm Hà",
        "type": "xa"
      },
      {
        "code": "15650",
        "name": "Xã Liên Minh",
        "type": "xa"
      },
      {
        "code": "30754",
        "name": "Xã Lý Nhân",
        "type": "xa"
      },
      {
        "code": "14882",
        "name": "Xã Minh Tân",
        "type": "xa"
      },
      {
        "code": "18978",
        "name": "Xã Minh Thái",
        "type": "xa"
      },
      {
        "code": "14114",
        "name": "Xã Nam Đồng",
        "type": "xa"
      },
      {
        "code": "14626",
        "name": "Xã Nam Hồng",
        "type": "xa"
      },
      {
        "code": "32290",
        "name": "Xã Nam Lý",
        "type": "xa"
      },
      {
        "code": "13858",
        "name": "Xã Nam Minh",
        "type": "xa"
      },
      {
        "code": "14370",
        "name": "Xã Nam Ninh",
        "type": "xa"
      },
      {
        "code": "13602",
        "name": "Xã Nam Trực",
        "type": "xa"
      },
      {
        "code": "31010",
        "name": "Xã Nam Xang",
        "type": "xa"
      },
      {
        "code": "22818",
        "name": "Xã Nghĩa Hưng",
        "type": "xa"
      },
      {
        "code": "23842",
        "name": "Xã Nghĩa Lâm",
        "type": "xa"
      },
      {
        "code": "23074",
        "name": "Xã Nghĩa Sơn",
        "type": "xa"
      },
      {
        "code": "32034",
        "name": "Xã Nhân Hà",
        "type": "xa"
      },
      {
        "code": "5666",
        "name": "Xã Nho Quan",
        "type": "xa"
      },
      {
        "code": "19234",
        "name": "Xã Ninh Cường",
        "type": "xa"
      },
      {
        "code": "17954",
        "name": "Xã Ninh Giang",
        "type": "xa"
      },
      {
        "code": "10786",
        "name": "Xã Phát Diệm",
        "type": "xa"
      },
      {
        "code": "17442",
        "name": "Xã Phong Doanh",
        "type": "xa"
      },
      {
        "code": "6946",
        "name": "Xã Phú Long",
        "type": "xa"
      },
      {
        "code": "6434",
        "name": "Xã Phú Sơn",
        "type": "xa"
      },
      {
        "code": "18722",
        "name": "Xã Quang Hưng",
        "type": "xa"
      },
      {
        "code": "10530",
        "name": "Xã Quang Thiện",
        "type": "xa"
      },
      {
        "code": "23586",
        "name": "Xã Quỹ Nhất",
        "type": "xa"
      },
      {
        "code": "7458",
        "name": "Xã Quỳnh Lưu",
        "type": "xa"
      },
      {
        "code": "24098",
        "name": "Xã Rạng Đông",
        "type": "xa"
      },
      {
        "code": "17186",
        "name": "Xã Tân Minh",
        "type": "xa"
      },
      {
        "code": "30242",
        "name": "Xã Tân Thanh",
        "type": "xa"
      },
      {
        "code": "1058",
        "name": "Xã Thanh Bình",
        "type": "xa"
      },
      {
        "code": "30498",
        "name": "Xã Thanh Lâm",
        "type": "xa"
      },
      {
        "code": "1314",
        "name": "Xã Thanh Liêm",
        "type": "xa"
      },
      {
        "code": "7202",
        "name": "Xã Thanh Sơn",
        "type": "xa"
      },
      {
        "code": "31778",
        "name": "Xã Trần Thương",
        "type": "xa"
      },
      {
        "code": "18466",
        "name": "Xã Trực Ninh",
        "type": "xa"
      },
      {
        "code": "16674",
        "name": "Xã Vạn Thắng",
        "type": "xa"
      },
      {
        "code": "31522",
        "name": "Xã Vĩnh Trụ",
        "type": "xa"
      },
      {
        "code": "15394",
        "name": "Xã Vụ Bản",
        "type": "xa"
      },
      {
        "code": "16930",
        "name": "Xã Vũ Dương",
        "type": "xa"
      },
      {
        "code": "20002",
        "name": "Xã Xuân Giang",
        "type": "xa"
      },
      {
        "code": "20258",
        "name": "Xã Xuân Hồng",
        "type": "xa"
      },
      {
        "code": "19746",
        "name": "Xã Xuân Hưng",
        "type": "xa"
      },
      {
        "code": "19490",
        "name": "Xã Xuân Trường",
        "type": "xa"
      },
      {
        "code": "15906",
        "name": "Xã Ý Yên",
        "type": "xa"
      },
      {
        "code": "16418",
        "name": "Xã Yên Cường",
        "type": "xa"
      },
      {
        "code": "16162",
        "name": "Xã Yên Đồng",
        "type": "xa"
      },
      {
        "code": "7714",
        "name": "Xã Yên Khánh",
        "type": "xa"
      },
      {
        "code": "9506",
        "name": "Xã Yên Mạc",
        "type": "xa"
      },
      {
        "code": "8994",
        "name": "Xã Yên Mô",
        "type": "xa"
      },
      {
        "code": "9250",
        "name": "Xã Yên Từ",
        "type": "xa"
      }
    ]
  },
  {
    "code": "35",
    "name": "Phú Thọ",
    "wards": [
      {
        "code": "23843",
        "name": "Phường Âu Cơ",
        "type": "phuong"
      },
      {
        "code": "12579",
        "name": "Phường Hòa Bình",
        "type": "phuong"
      },
      {
        "code": "12835",
        "name": "Phường Kỳ Sơn",
        "type": "phuong"
      },
      {
        "code": "37667",
        "name": "Phường Nông Trang",
        "type": "phuong"
      },
      {
        "code": "23331",
        "name": "Phường Phong Châu",
        "type": "phuong"
      },
      {
        "code": "23587",
        "name": "Phường Phú Thọ",
        "type": "phuong"
      },
      {
        "code": "2339",
        "name": "Phường Phúc Yên",
        "type": "phuong"
      },
      {
        "code": "13091",
        "name": "Phường Tân Hòa",
        "type": "phuong"
      },
      {
        "code": "37923",
        "name": "Phường Thanh Miếu",
        "type": "phuong"
      },
      {
        "code": "1827",
        "name": "Phường Thống Nhất",
        "type": "phuong"
      },
      {
        "code": "21795",
        "name": "Phường Vân Phú",
        "type": "phuong"
      },
      {
        "code": "37411",
        "name": "Phường Việt Trì",
        "type": "phuong"
      },
      {
        "code": "21283",
        "name": "Phường Vĩnh Phúc",
        "type": "phuong"
      },
      {
        "code": "21539",
        "name": "Phường Vĩnh Yên",
        "type": "phuong"
      },
      {
        "code": "2595",
        "name": "Phường Xuân Hòa",
        "type": "phuong"
      },
      {
        "code": "8739",
        "name": "Xã An Bình",
        "type": "xa"
      },
      {
        "code": "8995",
        "name": "Xã An Nghĩa",
        "type": "xa"
      },
      {
        "code": "23075",
        "name": "Xã Bản Nguyên",
        "type": "xa"
      },
      {
        "code": "9507",
        "name": "Xã Bao La",
        "type": "xa"
      },
      {
        "code": "27939",
        "name": "Xã Bằng Luân",
        "type": "xa"
      },
      {
        "code": "20259",
        "name": "Xã Bình Nguyên",
        "type": "xa"
      },
      {
        "code": "25123",
        "name": "Xã Bình Phú",
        "type": "xa"
      },
      {
        "code": "21027",
        "name": "Xã Bình Tuyền",
        "type": "xa"
      },
      {
        "code": "20771",
        "name": "Xã Bình Xuyên",
        "type": "xa"
      },
      {
        "code": "9251",
        "name": "Xã Cao Dương",
        "type": "xa"
      },
      {
        "code": "3107",
        "name": "Xã Cao Phong",
        "type": "xa"
      },
      {
        "code": "4131",
        "name": "Xã Cao Sơn",
        "type": "xa"
      },
      {
        "code": "29731",
        "name": "Xã Cẩm Khê",
        "type": "xa"
      },
      {
        "code": "27427",
        "name": "Xã Chân Mộng",
        "type": "xa"
      },
      {
        "code": "27683",
        "name": "Xã Chí Đám",
        "type": "xa"
      },
      {
        "code": "26403",
        "name": "Xã Chí Tiên",
        "type": "xa"
      },
      {
        "code": "33827",
        "name": "Xã Cự Đồng",
        "type": "xa"
      },
      {
        "code": "24355",
        "name": "Xã Dân Chủ",
        "type": "xa"
      },
      {
        "code": "5667",
        "name": "Xã Dũng Tiến",
        "type": "xa"
      },
      {
        "code": "3875",
        "name": "Xã Đà Bắc",
        "type": "xa"
      },
      {
        "code": "16163",
        "name": "Xã Đại Đình",
        "type": "xa"
      },
      {
        "code": "6947",
        "name": "Xã Đại Đồng",
        "type": "xa"
      },
      {
        "code": "28451",
        "name": "Xã Đan Thượng",
        "type": "xa"
      },
      {
        "code": "2083",
        "name": "Xã Đạo Trù",
        "type": "xa"
      },
      {
        "code": "32547",
        "name": "Xã Đào Xá",
        "type": "xa"
      },
      {
        "code": "26915",
        "name": "Xã Đoan Hùng",
        "type": "xa"
      },
      {
        "code": "30499",
        "name": "Xã Đồng Lương",
        "type": "xa"
      },
      {
        "code": "26147",
        "name": "Xã Đông Thành",
        "type": "xa"
      },
      {
        "code": "4387",
        "name": "Xã Đức Nhàn",
        "type": "xa"
      },
      {
        "code": "28195",
        "name": "Xã Hạ Hòa",
        "type": "xa"
      },
      {
        "code": "13859",
        "name": "Xã Hải Lựu",
        "type": "xa"
      },
      {
        "code": "29475",
        "name": "Xã Hiền Lương",
        "type": "xa"
      },
      {
        "code": "32035",
        "name": "Xã Hiền Quan",
        "type": "xa"
      },
      {
        "code": "16931",
        "name": "Xã Hoàng An",
        "type": "xa"
      },
      {
        "code": "25891",
        "name": "Xã Hoàng Cương",
        "type": "xa"
      },
      {
        "code": "16675",
        "name": "Xã Hội Thịnh",
        "type": "xa"
      },
      {
        "code": "5923",
        "name": "Xã Hợp Kim",
        "type": "xa"
      },
      {
        "code": "15395",
        "name": "Xã Hợp Lý",
        "type": "xa"
      },
      {
        "code": "30243",
        "name": "Xã Hùng Việt",
        "type": "xa"
      },
      {
        "code": "34083",
        "name": "Xã Hương Cần",
        "type": "xa"
      },
      {
        "code": "22051",
        "name": "Xã Hy Cương",
        "type": "xa"
      },
      {
        "code": "34595",
        "name": "Xã Khả Cửu",
        "type": "xa"
      },
      {
        "code": "5155",
        "name": "Xã Kim Bôi",
        "type": "xa"
      },
      {
        "code": "11811",
        "name": "Xã Lạc Lương",
        "type": "xa"
      },
      {
        "code": "6435",
        "name": "Xã Lạc Sơn",
        "type": "xa"
      },
      {
        "code": "8483",
        "name": "Xã Lạc Thủy",
        "type": "xa"
      },
      {
        "code": "35363",
        "name": "Xã Lai Đồng",
        "type": "xa"
      },
      {
        "code": "22307",
        "name": "Xã Lâm Thao",
        "type": "xa"
      },
      {
        "code": "14371",
        "name": "Xã Lập Thạch",
        "type": "xa"
      },
      {
        "code": "19491",
        "name": "Xã Liên Châu",
        "type": "xa"
      },
      {
        "code": "15139",
        "name": "Xã Liên Hòa",
        "type": "xa"
      },
      {
        "code": "26659",
        "name": "Xã Liên Minh",
        "type": "xa"
      },
      {
        "code": "1059",
        "name": "Xã Liên Sơn",
        "type": "xa"
      },
      {
        "code": "35875",
        "name": "Xã Long Cốc",
        "type": "xa"
      },
      {
        "code": "2851",
        "name": "Xã Lương Sơn",
        "type": "xa"
      },
      {
        "code": "1315",
        "name": "Xã Mai Châu",
        "type": "xa"
      },
      {
        "code": "9763",
        "name": "Xã Mai Hạ",
        "type": "xa"
      },
      {
        "code": "35107",
        "name": "Xã Minh Đài",
        "type": "xa"
      },
      {
        "code": "37155",
        "name": "Xã Minh Hòa",
        "type": "xa"
      },
      {
        "code": "10531",
        "name": "Xã Mường Bi",
        "type": "xa"
      },
      {
        "code": "5411",
        "name": "Xã Mường Động",
        "type": "xa"
      },
      {
        "code": "11043",
        "name": "Xã Mường Hoa",
        "type": "xa"
      },
      {
        "code": "3363",
        "name": "Xã Mường Thàng",
        "type": "xa"
      },
      {
        "code": "6691",
        "name": "Xã Mường Vang",
        "type": "xa"
      },
      {
        "code": "6179",
        "name": "Xã Nật Sơn",
        "type": "xa"
      },
      {
        "code": "7203",
        "name": "Xã Ngọc Sơn",
        "type": "xa"
      },
      {
        "code": "20003",
        "name": "Xã Nguyệt Đức",
        "type": "xa"
      },
      {
        "code": "7459",
        "name": "Xã Nhân Nghĩa",
        "type": "xa"
      },
      {
        "code": "1571",
        "name": "Xã Pà Cò",
        "type": "xa"
      },
      {
        "code": "29987",
        "name": "Xã Phú Khê",
        "type": "xa"
      },
      {
        "code": "24611",
        "name": "Xã Phú Mỹ",
        "type": "xa"
      },
      {
        "code": "24099",
        "name": "Xã Phù Ninh",
        "type": "xa"
      },
      {
        "code": "22819",
        "name": "Xã Phùng Nguyên",
        "type": "xa"
      },
      {
        "code": "25635",
        "name": "Xã Quảng Yên",
        "type": "xa"
      },
      {
        "code": "4643",
        "name": "Xã Quy Đức",
        "type": "xa"
      },
      {
        "code": "7715",
        "name": "Xã Quyết Thắng",
        "type": "xa"
      },
      {
        "code": "13603",
        "name": "Xã Sông Lô",
        "type": "xa"
      },
      {
        "code": "15651",
        "name": "Xã Sơn Đông",
        "type": "xa"
      },
      {
        "code": "36643",
        "name": "Xã Sơn Lương",
        "type": "xa"
      },
      {
        "code": "16419",
        "name": "Xã Tam Dương",
        "type": "xa"
      },
      {
        "code": "17187",
        "name": "Xã Tam Dương Bắc",
        "type": "xa"
      },
      {
        "code": "15907",
        "name": "Xã Tam Đảo",
        "type": "xa"
      },
      {
        "code": "19747",
        "name": "Xã Tam Hồng",
        "type": "xa"
      },
      {
        "code": "31267",
        "name": "Xã Tam Nông",
        "type": "xa"
      },
      {
        "code": "13347",
        "name": "Xã Tam Sơn",
        "type": "xa"
      },
      {
        "code": "10275",
        "name": "Xã Tân Lạc",
        "type": "xa"
      },
      {
        "code": "10019",
        "name": "Xã Tân Mai",
        "type": "xa"
      },
      {
        "code": "4899",
        "name": "Xã Tân Pheo",
        "type": "xa"
      },
      {
        "code": "34851",
        "name": "Xã Tân Sơn",
        "type": "xa"
      },
      {
        "code": "27171",
        "name": "Xã Tây Cốc",
        "type": "xa"
      },
      {
        "code": "19235",
        "name": "Xã Tề Lỗ",
        "type": "xa"
      },
      {
        "code": "14883",
        "name": "Xã Thái Hòa",
        "type": "xa"
      },
      {
        "code": "25379",
        "name": "Xã Thanh Ba",
        "type": "xa"
      },
      {
        "code": "33059",
        "name": "Xã Thanh Sơn",
        "type": "xa"
      },
      {
        "code": "32291",
        "name": "Xã Thanh Thủy",
        "type": "xa"
      },
      {
        "code": "12323",
        "name": "Xã Thịnh Minh",
        "type": "xa"
      },
      {
        "code": "31523",
        "name": "Xã Thọ Văn",
        "type": "xa"
      },
      {
        "code": "17699",
        "name": "Xã Thổ Tang",
        "type": "xa"
      },
      {
        "code": "547",
        "name": "Xã Thu Cúc",
        "type": "xa"
      },
      {
        "code": "3619",
        "name": "Xã Thung Nai",
        "type": "xa"
      },
      {
        "code": "7971",
        "name": "Xã Thượng Cốc",
        "type": "xa"
      },
      {
        "code": "36387",
        "name": "Xã Thượng Long",
        "type": "xa"
      },
      {
        "code": "14627",
        "name": "Xã Tiên Lữ",
        "type": "xa"
      },
      {
        "code": "30755",
        "name": "Xã Tiên Lương",
        "type": "xa"
      },
      {
        "code": "803",
        "name": "Xã Tiền Phong",
        "type": "xa"
      },
      {
        "code": "10787",
        "name": "Xã Toàn Thắng",
        "type": "xa"
      },
      {
        "code": "24867",
        "name": "Xã Trạm Thản",
        "type": "xa"
      },
      {
        "code": "291",
        "name": "Xã Trung Sơn",
        "type": "xa"
      },
      {
        "code": "32803",
        "name": "Xã Tu Vũ",
        "type": "xa"
      },
      {
        "code": "31779",
        "name": "Xã Vạn Xuân",
        "type": "xa"
      },
      {
        "code": "29219",
        "name": "Xã Văn Lang",
        "type": "xa"
      },
      {
        "code": "33571",
        "name": "Xã Văn Miếu",
        "type": "xa"
      },
      {
        "code": "31011",
        "name": "Xã Vân Bán",
        "type": "xa"
      },
      {
        "code": "11299",
        "name": "Xã Vân Sơn",
        "type": "xa"
      },
      {
        "code": "18211",
        "name": "Xã Vĩnh An",
        "type": "xa"
      },
      {
        "code": "28963",
        "name": "Xã Vĩnh Chân",
        "type": "xa"
      },
      {
        "code": "17955",
        "name": "Xã Vĩnh Hưng",
        "type": "xa"
      },
      {
        "code": "18467",
        "name": "Xã Vĩnh Phú",
        "type": "xa"
      },
      {
        "code": "18723",
        "name": "Xã Vĩnh Thành",
        "type": "xa"
      },
      {
        "code": "17443",
        "name": "Xã Vĩnh Tường",
        "type": "xa"
      },
      {
        "code": "33315",
        "name": "Xã Võ Miếu",
        "type": "xa"
      },
      {
        "code": "35619",
        "name": "Xã Xuân Đài",
        "type": "xa"
      },
      {
        "code": "20515",
        "name": "Xã Xuân Lãng",
        "type": "xa"
      },
      {
        "code": "22563",
        "name": "Xã Xuân Lũng",
        "type": "xa"
      },
      {
        "code": "36899",
        "name": "Xã Xuân Viên",
        "type": "xa"
      },
      {
        "code": "28707",
        "name": "Xã Yên Kỳ",
        "type": "xa"
      },
      {
        "code": "18979",
        "name": "Xã Yên Lạc",
        "type": "xa"
      },
      {
        "code": "14115",
        "name": "Xã Yên Lãng",
        "type": "xa"
      },
      {
        "code": "36131",
        "name": "Xã Yên Lập",
        "type": "xa"
      },
      {
        "code": "8227",
        "name": "Xã Yên Phú",
        "type": "xa"
      },
      {
        "code": "34339",
        "name": "Xã Yên Sơn",
        "type": "xa"
      },
      {
        "code": "11555",
        "name": "Xã Yên Thủy",
        "type": "xa"
      },
      {
        "code": "12067",
        "name": "Xã Yên Trị",
        "type": "xa"
      }
    ]
  },
  {
    "code": "36",
    "name": "Quảng Ngãi",
    "wards": [
      {
        "code": "2852",
        "name": "Đặc Khu Lý Sơn",
        "type": "dac-khu"
      },
      {
        "code": "3876",
        "name": "Phường Cẩm Thành",
        "type": "phuong"
      },
      {
        "code": "16420",
        "name": "Phường Đăk Bla",
        "type": "phuong"
      },
      {
        "code": "16164",
        "name": "Phường Đăk Cấm",
        "type": "phuong"
      },
      {
        "code": "4900",
        "name": "Phường Đức Phổ",
        "type": "phuong"
      },
      {
        "code": "15908",
        "name": "Phường Kon Tum",
        "type": "phuong"
      },
      {
        "code": "4132",
        "name": "Phường Nghĩa Lộ",
        "type": "phuong"
      },
      {
        "code": "5412",
        "name": "Phường Sa Huỳnh",
        "type": "phuong"
      },
      {
        "code": "4388",
        "name": "Phường Trà Câu",
        "type": "phuong"
      },
      {
        "code": "3364",
        "name": "Phường Trương Quang Trọng",
        "type": "phuong"
      },
      {
        "code": "3620",
        "name": "Xã An Phú",
        "type": "xa"
      },
      {
        "code": "14372",
        "name": "Xã Ba Dinh",
        "type": "xa"
      },
      {
        "code": "15140",
        "name": "Xã Ba Động",
        "type": "xa"
      },
      {
        "code": "6436",
        "name": "Xã Ba Gia",
        "type": "xa"
      },
      {
        "code": "14116",
        "name": "Xã Ba Tô",
        "type": "xa"
      },
      {
        "code": "14628",
        "name": "Xã Ba Tơ",
        "type": "xa"
      },
      {
        "code": "13860",
        "name": "Xã Ba Vì",
        "type": "xa"
      },
      {
        "code": "14884",
        "name": "Xã Ba Vinh",
        "type": "xa"
      },
      {
        "code": "548",
        "name": "Xã Ba Xa",
        "type": "xa"
      },
      {
        "code": "5924",
        "name": "Xã Bình Chương",
        "type": "xa"
      },
      {
        "code": "5668",
        "name": "Xã Bình Minh",
        "type": "xa"
      },
      {
        "code": "15652",
        "name": "Xã Bình Sơn",
        "type": "xa"
      },
      {
        "code": "20516",
        "name": "Xã Bờ Y",
        "type": "xa"
      },
      {
        "code": "804",
        "name": "Xã Cà Đam",
        "type": "xa"
      },
      {
        "code": "21028",
        "name": "Xã Dục Nông",
        "type": "xa"
      },
      {
        "code": "18468",
        "name": "Xã Đăk Hà",
        "type": "xa"
      },
      {
        "code": "23332",
        "name": "Xã Đăk Kôi",
        "type": "xa"
      },
      {
        "code": "292",
        "name": "Xã Đăk Long",
        "type": "xa"
      },
      {
        "code": "17700",
        "name": "Xã Đăk Mar",
        "type": "xa"
      },
      {
        "code": "22308",
        "name": "Xã Đăk Môn",
        "type": "xa"
      },
      {
        "code": "22052",
        "name": "Xã Đăk Pék",
        "type": "xa"
      },
      {
        "code": "21796",
        "name": "Xã Đăk Plô",
        "type": "xa"
      },
      {
        "code": "17444",
        "name": "Xã Đăk Pxi",
        "type": "xa"
      },
      {
        "code": "17188",
        "name": "Xã Đăk Rơ Wa",
        "type": "xa"
      },
      {
        "code": "23844",
        "name": "Xã Đăk Rve",
        "type": "xa"
      },
      {
        "code": "19492",
        "name": "Xã Đăk Sao",
        "type": "xa"
      },
      {
        "code": "18980",
        "name": "Xã Đăk Tô",
        "type": "xa"
      },
      {
        "code": "19748",
        "name": "Xã Đăk Tờ Kan",
        "type": "xa"
      },
      {
        "code": "17956",
        "name": "Xã Đăk Ui",
        "type": "xa"
      },
      {
        "code": "15396",
        "name": "Xã Đặng Thùy Trâm",
        "type": "xa"
      },
      {
        "code": "8484",
        "name": "Xã Đình Cương",
        "type": "xa"
      },
      {
        "code": "2596",
        "name": "Xã Đông Sơn",
        "type": "xa"
      },
      {
        "code": "10532",
        "name": "Xã Đông Trà Bồng",
        "type": "xa"
      },
      {
        "code": "16932",
        "name": "Xã Ia Chim",
        "type": "xa"
      },
      {
        "code": "1828",
        "name": "Xã Ia Đal",
        "type": "xa"
      },
      {
        "code": "2084",
        "name": "Xã Ia Tơi",
        "type": "xa"
      },
      {
        "code": "5156",
        "name": "Xã Khánh Cường",
        "type": "xa"
      },
      {
        "code": "23588",
        "name": "Xã Kon Braih",
        "type": "xa"
      },
      {
        "code": "19236",
        "name": "Xã Kon Đào",
        "type": "xa"
      },
      {
        "code": "24612",
        "name": "Xã Kon Plông",
        "type": "xa"
      },
      {
        "code": "10020",
        "name": "Xã Lân Phong",
        "type": "xa"
      },
      {
        "code": "9252",
        "name": "Xã Long Phụng",
        "type": "xa"
      },
      {
        "code": "24356",
        "name": "Xã Măng Bút",
        "type": "xa"
      },
      {
        "code": "24100",
        "name": "Xã Măng Đen",
        "type": "xa"
      },
      {
        "code": "20260",
        "name": "Xã Măng Ri",
        "type": "xa"
      },
      {
        "code": "13348",
        "name": "Xã Minh Long",
        "type": "xa"
      },
      {
        "code": "9508",
        "name": "Xã Mỏ Cày",
        "type": "xa"
      },
      {
        "code": "9764",
        "name": "Xã Mộ Đức",
        "type": "xa"
      },
      {
        "code": "1316",
        "name": "Xã Mô Rai",
        "type": "xa"
      },
      {
        "code": "7716",
        "name": "Xã Nghĩa Giang",
        "type": "xa"
      },
      {
        "code": "8228",
        "name": "Xã Nghĩa Hành",
        "type": "xa"
      },
      {
        "code": "21540",
        "name": "Xã Ngọc Linh",
        "type": "xa"
      },
      {
        "code": "16676",
        "name": "Xã Ngọk Bay",
        "type": "xa"
      },
      {
        "code": "18212",
        "name": "Xã Ngọk Réo",
        "type": "xa"
      },
      {
        "code": "18724",
        "name": "Xã Ngọk Tụ",
        "type": "xa"
      },
      {
        "code": "4644",
        "name": "Xã Nguyễn Nghiêm",
        "type": "xa"
      },
      {
        "code": "8996",
        "name": "Xã Phước Giang",
        "type": "xa"
      },
      {
        "code": "1572",
        "name": "Xã Rờ Kơi",
        "type": "xa"
      },
      {
        "code": "22820",
        "name": "Xã Sa Bình",
        "type": "xa"
      },
      {
        "code": "20772",
        "name": "Xã Sa Loong",
        "type": "xa"
      },
      {
        "code": "22564",
        "name": "Xã Sa Thầy",
        "type": "xa"
      },
      {
        "code": "11812",
        "name": "Xã Sơn Hà",
        "type": "xa"
      },
      {
        "code": "11300",
        "name": "Xã Sơn Hạ",
        "type": "xa"
      },
      {
        "code": "12324",
        "name": "Xã Sơn Kỳ",
        "type": "xa"
      },
      {
        "code": "11556",
        "name": "Xã Sơn Linh",
        "type": "xa"
      },
      {
        "code": "13604",
        "name": "Xã Sơn Mai",
        "type": "xa"
      },
      {
        "code": "12580",
        "name": "Xã Sơn Tây",
        "type": "xa"
      },
      {
        "code": "13092",
        "name": "Xã Sơn Tây Hạ",
        "type": "xa"
      },
      {
        "code": "12836",
        "name": "Xã Sơn Tây Thượng",
        "type": "xa"
      },
      {
        "code": "12068",
        "name": "Xã Sơn Thủy",
        "type": "xa"
      },
      {
        "code": "6692",
        "name": "Xã Sơn Tịnh",
        "type": "xa"
      },
      {
        "code": "10788",
        "name": "Xã Tây Trà",
        "type": "xa"
      },
      {
        "code": "2340",
        "name": "Xã Tây Trà Bồng",
        "type": "xa"
      },
      {
        "code": "11044",
        "name": "Xã Thanh Bồng",
        "type": "xa"
      },
      {
        "code": "8740",
        "name": "Xã Thiện Tín",
        "type": "xa"
      },
      {
        "code": "6948",
        "name": "Xã Thọ Phong",
        "type": "xa"
      },
      {
        "code": "3108",
        "name": "Xã Tịnh Khê",
        "type": "xa"
      },
      {
        "code": "10276",
        "name": "Xã Trà Bồng",
        "type": "xa"
      },
      {
        "code": "7972",
        "name": "Xã Trà Giang",
        "type": "xa"
      },
      {
        "code": "6180",
        "name": "Xã Trường Giang",
        "type": "xa"
      },
      {
        "code": "20004",
        "name": "Xã Tu Mơ Rông",
        "type": "xa"
      },
      {
        "code": "7204",
        "name": "Xã Tư Nghĩa",
        "type": "xa"
      },
      {
        "code": "1060",
        "name": "Xã Vạn Tường",
        "type": "xa"
      },
      {
        "code": "7460",
        "name": "Xã Vệ Giang",
        "type": "xa"
      },
      {
        "code": "21284",
        "name": "Xã Xốp",
        "type": "xa"
      },
      {
        "code": "23076",
        "name": "Xã Ya Ly",
        "type": "xa"
      }
    ]
  },
  {
    "code": "37",
    "name": "Quảng Ninh",
    "wards": [
      {
        "code": "12581",
        "name": "Đặc Khu Cô Tô",
        "type": "dac-khu"
      },
      {
        "code": "12325",
        "name": "Đặc Khu Vân Đồn",
        "type": "dac-khu"
      },
      {
        "code": "3365",
        "name": "Phường An Sinh",
        "type": "phuong"
      },
      {
        "code": "6949",
        "name": "Phường Bãi Cháy",
        "type": "phuong"
      },
      {
        "code": "4901",
        "name": "Phường Bình Khê",
        "type": "phuong"
      },
      {
        "code": "7461",
        "name": "Phường Cao Xanh",
        "type": "phuong"
      },
      {
        "code": "8741",
        "name": "Phường Cẩm Phả",
        "type": "phuong"
      },
      {
        "code": "8997",
        "name": "Phường Cửa Ông",
        "type": "phuong"
      },
      {
        "code": "5925",
        "name": "Phường Đông Mai",
        "type": "phuong"
      },
      {
        "code": "12837",
        "name": "Phường Đông Triều",
        "type": "phuong"
      },
      {
        "code": "2085",
        "name": "Phường Hà An",
        "type": "phuong"
      },
      {
        "code": "7205",
        "name": "Phường Hà Lầm",
        "type": "phuong"
      },
      {
        "code": "7973",
        "name": "Phường Hạ Long",
        "type": "phuong"
      },
      {
        "code": "3109",
        "name": "Phường Hà Tu",
        "type": "phuong"
      },
      {
        "code": "6181",
        "name": "Phường Hiệp Hòa",
        "type": "phuong"
      },
      {
        "code": "5413",
        "name": "Phường Hoàng Quế",
        "type": "phuong"
      },
      {
        "code": "805",
        "name": "Phường Hoành Bồ",
        "type": "phuong"
      },
      {
        "code": "7717",
        "name": "Phường Hồng Gai",
        "type": "phuong"
      },
      {
        "code": "2341",
        "name": "Phường Liên Hòa",
        "type": "phuong"
      },
      {
        "code": "5157",
        "name": "Phường Mạo Khê",
        "type": "phuong"
      },
      {
        "code": "11301",
        "name": "Phường Móng Cái 1",
        "type": "phuong"
      },
      {
        "code": "11557",
        "name": "Phường Móng Cái 2",
        "type": "phuong"
      },
      {
        "code": "11813",
        "name": "Phường Móng Cái 3",
        "type": "phuong"
      },
      {
        "code": "8485",
        "name": "Phường Mông Dương",
        "type": "phuong"
      },
      {
        "code": "6693",
        "name": "Phường Phong Cốc",
        "type": "phuong"
      },
      {
        "code": "2597",
        "name": "Phường Quang Hanh",
        "type": "phuong"
      },
      {
        "code": "6437",
        "name": "Phường Quảng Yên",
        "type": "phuong"
      },
      {
        "code": "2853",
        "name": "Phường Tuần Châu",
        "type": "phuong"
      },
      {
        "code": "13093",
        "name": "Phường Uông Bí",
        "type": "phuong"
      },
      {
        "code": "293",
        "name": "Phường Vàng Danh",
        "type": "phuong"
      },
      {
        "code": "4645",
        "name": "Phường Việt Hưng",
        "type": "phuong"
      },
      {
        "code": "5669",
        "name": "Phường Yên Tử",
        "type": "phuong"
      },
      {
        "code": "13605",
        "name": "Xã Ba Chẽ",
        "type": "xa"
      },
      {
        "code": "13861",
        "name": "Xã Bình Liêu",
        "type": "xa"
      },
      {
        "code": "4133",
        "name": "Xã Cái Chiên",
        "type": "xa"
      },
      {
        "code": "12069",
        "name": "Xã Đầm Hà",
        "type": "xa"
      },
      {
        "code": "4389",
        "name": "Xã Điền Xá",
        "type": "xa"
      },
      {
        "code": "1317",
        "name": "Xã Đông Ngũ",
        "type": "xa"
      },
      {
        "code": "549",
        "name": "Xã Đường Hoa",
        "type": "xa"
      },
      {
        "code": "1829",
        "name": "Xã Hải Hòa",
        "type": "xa"
      },
      {
        "code": "1573",
        "name": "Xã Hải Lạng",
        "type": "xa"
      },
      {
        "code": "11045",
        "name": "Xã Hải Ninh",
        "type": "xa"
      },
      {
        "code": "10789",
        "name": "Xã Hải Sơn",
        "type": "xa"
      },
      {
        "code": "10277",
        "name": "Xã Hoành Mô",
        "type": "xa"
      },
      {
        "code": "9509",
        "name": "Xã Kỳ Thượng",
        "type": "xa"
      },
      {
        "code": "10533",
        "name": "Xã Lục Hồn",
        "type": "xa"
      },
      {
        "code": "9253",
        "name": "Xã Lương Minh",
        "type": "xa"
      },
      {
        "code": "10021",
        "name": "Xã Quảng Đức",
        "type": "xa"
      },
      {
        "code": "3877",
        "name": "Xã Quảng Hà",
        "type": "xa"
      },
      {
        "code": "8229",
        "name": "Xã Quảng La",
        "type": "xa"
      },
      {
        "code": "9765",
        "name": "Xã Quảng Tân",
        "type": "xa"
      },
      {
        "code": "1061",
        "name": "Xã Thống Nhất",
        "type": "xa"
      },
      {
        "code": "13349",
        "name": "Xã Tiên Yên",
        "type": "xa"
      },
      {
        "code": "3621",
        "name": "Xã Vĩnh Thực",
        "type": "xa"
      }
    ]
  },
  {
    "code": "38",
    "name": "Quảng Trị",
    "wards": [
      {
        "code": "550",
        "name": "Đặc Khu Cồn Cỏ",
        "type": "dac-khu"
      },
      {
        "code": "1830",
        "name": "Phường Ba Đồn",
        "type": "phuong"
      },
      {
        "code": "2086",
        "name": "Phường Bắc Gianh",
        "type": "phuong"
      },
      {
        "code": "16934",
        "name": "Phường Đông Hà",
        "type": "phuong"
      },
      {
        "code": "1062",
        "name": "Phường Đồng Hới",
        "type": "phuong"
      },
      {
        "code": "1574",
        "name": "Phường Đồng Sơn",
        "type": "phuong"
      },
      {
        "code": "1318",
        "name": "Phường Đồng Thuận",
        "type": "phuong"
      },
      {
        "code": "17190",
        "name": "Phường Nam Đông Hà",
        "type": "phuong"
      },
      {
        "code": "18726",
        "name": "Phường Quảng Trị",
        "type": "phuong"
      },
      {
        "code": "16678",
        "name": "Xã A Dơi",
        "type": "xa"
      },
      {
        "code": "17702",
        "name": "Xã Ái Tử",
        "type": "xa"
      },
      {
        "code": "14630",
        "name": "Xã Ba Lòng",
        "type": "xa"
      },
      {
        "code": "6950",
        "name": "Xã Bắc Trạch",
        "type": "xa"
      },
      {
        "code": "13094",
        "name": "Xã Bến Hải",
        "type": "xa"
      },
      {
        "code": "12070",
        "name": "Xã Bến Quan",
        "type": "xa"
      },
      {
        "code": "7718",
        "name": "Xã Bố Trạch",
        "type": "xa"
      },
      {
        "code": "9510",
        "name": "Xã Cam Hồng",
        "type": "xa"
      },
      {
        "code": "13350",
        "name": "Xã Cam Lộ",
        "type": "xa"
      },
      {
        "code": "12326",
        "name": "Xã Cồn Tiên",
        "type": "xa"
      },
      {
        "code": "11302",
        "name": "Xã Cửa Tùng",
        "type": "xa"
      },
      {
        "code": "12582",
        "name": "Xã Cửa Việt",
        "type": "xa"
      },
      {
        "code": "2854",
        "name": "Xã Dân Hóa",
        "type": "xa"
      },
      {
        "code": "18982",
        "name": "Xã Diên Sanh",
        "type": "xa"
      },
      {
        "code": "14374",
        "name": "Xã Đakrông",
        "type": "xa"
      },
      {
        "code": "4390",
        "name": "Xã Đồng Lê",
        "type": "xa"
      },
      {
        "code": "7206",
        "name": "Xã Đông Trạch",
        "type": "xa"
      },
      {
        "code": "12838",
        "name": "Xã Gio Linh",
        "type": "xa"
      },
      {
        "code": "19494",
        "name": "Xã Hải Lăng",
        "type": "xa"
      },
      {
        "code": "13606",
        "name": "Xã Hiếu Giang",
        "type": "xa"
      },
      {
        "code": "6182",
        "name": "Xã Hòa Trạch",
        "type": "xa"
      },
      {
        "code": "7462",
        "name": "Xã Hoàn Lão",
        "type": "xa"
      },
      {
        "code": "14886",
        "name": "Xã Hướng Hiệp",
        "type": "xa"
      },
      {
        "code": "15142",
        "name": "Xã Hướng Lập",
        "type": "xa"
      },
      {
        "code": "15398",
        "name": "Xã Hướng Phùng",
        "type": "xa"
      },
      {
        "code": "15654",
        "name": "Xã Khe Sanh",
        "type": "xa"
      },
      {
        "code": "3110",
        "name": "Xã Kim Điền",
        "type": "xa"
      },
      {
        "code": "10790",
        "name": "Xã Kim Ngân",
        "type": "xa"
      },
      {
        "code": "3366",
        "name": "Xã Kim Phú",
        "type": "xa"
      },
      {
        "code": "13862",
        "name": "Xã La Lay",
        "type": "xa"
      },
      {
        "code": "16166",
        "name": "Xã Lao Bảo",
        "type": "xa"
      },
      {
        "code": "10534",
        "name": "Xã Lệ Ninh",
        "type": "xa"
      },
      {
        "code": "9254",
        "name": "Xã Lệ Thủy",
        "type": "xa"
      },
      {
        "code": "16422",
        "name": "Xã Lìa",
        "type": "xa"
      },
      {
        "code": "3622",
        "name": "Xã Minh Hóa",
        "type": "xa"
      },
      {
        "code": "19238",
        "name": "Xã Mỹ Thủy",
        "type": "xa"
      },
      {
        "code": "2598",
        "name": "Xã Nam Ba Đồn",
        "type": "xa"
      },
      {
        "code": "18470",
        "name": "Xã Nam Cửa Việt",
        "type": "xa"
      },
      {
        "code": "2342",
        "name": "Xã Nam Gianh",
        "type": "xa"
      },
      {
        "code": "19750",
        "name": "Xã Nam Hải Lăng",
        "type": "xa"
      },
      {
        "code": "7974",
        "name": "Xã Nam Trạch",
        "type": "xa"
      },
      {
        "code": "8486",
        "name": "Xã Ninh Châu",
        "type": "xa"
      },
      {
        "code": "6694",
        "name": "Xã Phong Nha",
        "type": "xa"
      },
      {
        "code": "294",
        "name": "Xã Phú Trạch",
        "type": "xa"
      },
      {
        "code": "8230",
        "name": "Xã Quảng Ninh",
        "type": "xa"
      },
      {
        "code": "5926",
        "name": "Xã Quảng Trạch",
        "type": "xa"
      },
      {
        "code": "9766",
        "name": "Xã Sen Ngư",
        "type": "xa"
      },
      {
        "code": "14118",
        "name": "Xã Tà Rụt",
        "type": "xa"
      },
      {
        "code": "5414",
        "name": "Xã Tân Gianh",
        "type": "xa"
      },
      {
        "code": "15910",
        "name": "Xã Tân Lập",
        "type": "xa"
      },
      {
        "code": "10022",
        "name": "Xã Tân Mỹ",
        "type": "xa"
      },
      {
        "code": "806",
        "name": "Xã Tân Thành",
        "type": "xa"
      },
      {
        "code": "6438",
        "name": "Xã Thượng Trạch",
        "type": "xa"
      },
      {
        "code": "17958",
        "name": "Xã Triệu Bình",
        "type": "xa"
      },
      {
        "code": "18214",
        "name": "Xã Triệu Cơ",
        "type": "xa"
      },
      {
        "code": "17446",
        "name": "Xã Triệu Phong",
        "type": "xa"
      },
      {
        "code": "5670",
        "name": "Xã Trung Thuần",
        "type": "xa"
      },
      {
        "code": "8742",
        "name": "Xã Trường Ninh",
        "type": "xa"
      },
      {
        "code": "10278",
        "name": "Xã Trường Phú",
        "type": "xa"
      },
      {
        "code": "8998",
        "name": "Xã Trường Sơn",
        "type": "xa"
      },
      {
        "code": "4902",
        "name": "Xã Tuyên Bình",
        "type": "xa"
      },
      {
        "code": "5158",
        "name": "Xã Tuyên Hóa",
        "type": "xa"
      },
      {
        "code": "3878",
        "name": "Xã Tuyên Lâm",
        "type": "xa"
      },
      {
        "code": "4646",
        "name": "Xã Tuyên Phú",
        "type": "xa"
      },
      {
        "code": "4134",
        "name": "Xã Tuyên Sơn",
        "type": "xa"
      },
      {
        "code": "20006",
        "name": "Xã Vĩnh Định",
        "type": "xa"
      },
      {
        "code": "11558",
        "name": "Xã Vĩnh Hoàng",
        "type": "xa"
      },
      {
        "code": "11046",
        "name": "Xã Vĩnh Linh",
        "type": "xa"
      },
      {
        "code": "11814",
        "name": "Xã Vĩnh Thủy",
        "type": "xa"
      }
    ]
  },
  {
    "code": "39",
    "name": "Sơn La",
    "wards": [
      {
        "code": "2599",
        "name": "Phường Chiềng An",
        "type": "phuong"
      },
      {
        "code": "807",
        "name": "Phường Chiềng Cơi",
        "type": "phuong"
      },
      {
        "code": "2855",
        "name": "Phường Chiềng Sinh",
        "type": "phuong"
      },
      {
        "code": "19239",
        "name": "Phường Mộc Châu",
        "type": "phuong"
      },
      {
        "code": "3111",
        "name": "Phường Mộc Sơn",
        "type": "phuong"
      },
      {
        "code": "3623",
        "name": "Phường Thảo Nguyên",
        "type": "phuong"
      },
      {
        "code": "2343",
        "name": "Phường Tô Hiệu",
        "type": "phuong"
      },
      {
        "code": "3367",
        "name": "Phường Vân Sơn",
        "type": "phuong"
      },
      {
        "code": "10023",
        "name": "Xã Bắc Yên",
        "type": "xa"
      },
      {
        "code": "8231",
        "name": "Xã Bình Thuận",
        "type": "xa"
      },
      {
        "code": "16423",
        "name": "Xã Bó Sinh",
        "type": "xa"
      },
      {
        "code": "13607",
        "name": "Xã Chiềng Hặc",
        "type": "xa"
      },
      {
        "code": "9767",
        "name": "Xã Chiềng Hoa",
        "type": "xa"
      },
      {
        "code": "17191",
        "name": "Xã Chiềng Khoong",
        "type": "xa"
      },
      {
        "code": "16679",
        "name": "Xã Chiềng Khương",
        "type": "xa"
      },
      {
        "code": "6951",
        "name": "Xã Chiềng La",
        "type": "xa"
      },
      {
        "code": "9255",
        "name": "Xã Chiềng Lao",
        "type": "xa"
      },
      {
        "code": "14375",
        "name": "Xã Chiềng Mai",
        "type": "xa"
      },
      {
        "code": "15143",
        "name": "Xã Chiềng Mung",
        "type": "xa"
      },
      {
        "code": "11303",
        "name": "Xã Chiềng Sại",
        "type": "xa"
      },
      {
        "code": "18471",
        "name": "Xã Chiềng Sơ",
        "type": "xa"
      },
      {
        "code": "4391",
        "name": "Xã Chiềng Sơn",
        "type": "xa"
      },
      {
        "code": "16167",
        "name": "Xã Chiềng Sung",
        "type": "xa"
      },
      {
        "code": "7975",
        "name": "Xã Co Mạ",
        "type": "xa"
      },
      {
        "code": "3879",
        "name": "Xã Đoàn Kết",
        "type": "xa"
      },
      {
        "code": "11815",
        "name": "Xã Gia Phù",
        "type": "xa"
      },
      {
        "code": "18215",
        "name": "Xã Huổi Một",
        "type": "xa"
      },
      {
        "code": "13095",
        "name": "Xã Kim Bon",
        "type": "xa"
      },
      {
        "code": "8743",
        "name": "Xã Long Hẹ",
        "type": "xa"
      },
      {
        "code": "13863",
        "name": "Xã Lóng Phiêng",
        "type": "xa"
      },
      {
        "code": "4135",
        "name": "Xã Lóng Sập",
        "type": "xa"
      },
      {
        "code": "14631",
        "name": "Xã Mai Sơn",
        "type": "xa"
      },
      {
        "code": "7463",
        "name": "Xã Muổi Nọi",
        "type": "xa"
      },
      {
        "code": "295",
        "name": "Xã Mường Bám",
        "type": "xa"
      },
      {
        "code": "12583",
        "name": "Xã Mường Bang",
        "type": "xa"
      },
      {
        "code": "9511",
        "name": "Xã Mường Bú",
        "type": "xa"
      },
      {
        "code": "15655",
        "name": "Xã Mường Chanh",
        "type": "xa"
      },
      {
        "code": "5927",
        "name": "Xã Mường Chiên",
        "type": "xa"
      },
      {
        "code": "12327",
        "name": "Xã Mường Cơi",
        "type": "xa"
      },
      {
        "code": "8487",
        "name": "Xã Mường É",
        "type": "xa"
      },
      {
        "code": "6183",
        "name": "Xã Mường Giôn",
        "type": "xa"
      },
      {
        "code": "16935",
        "name": "Xã Mường Hung",
        "type": "xa"
      },
      {
        "code": "7719",
        "name": "Xã Mường Khiêng",
        "type": "xa"
      },
      {
        "code": "8999",
        "name": "Xã Mường La",
        "type": "xa"
      },
      {
        "code": "1319",
        "name": "Xã Mường Lạn",
        "type": "xa"
      },
      {
        "code": "17447",
        "name": "Xã Mường Lầm",
        "type": "xa"
      },
      {
        "code": "2087",
        "name": "Xã Mường Lèo",
        "type": "xa"
      },
      {
        "code": "6439",
        "name": "Xã Mường Sại",
        "type": "xa"
      },
      {
        "code": "7207",
        "name": "Xã Nậm Lầu",
        "type": "xa"
      },
      {
        "code": "17703",
        "name": "Xã Nậm Ty",
        "type": "xa"
      },
      {
        "code": "1831",
        "name": "Xã Ngọc Chiến",
        "type": "xa"
      },
      {
        "code": "11047",
        "name": "Xã Pắc Ngà",
        "type": "xa"
      },
      {
        "code": "15399",
        "name": "Xã Phiêng Cằm",
        "type": "xa"
      },
      {
        "code": "551",
        "name": "Xã Phiêng Khoài",
        "type": "xa"
      },
      {
        "code": "14887",
        "name": "Xã Phiêng Pằn",
        "type": "xa"
      },
      {
        "code": "11559",
        "name": "Xã Phù Yên",
        "type": "xa"
      },
      {
        "code": "18983",
        "name": "Xã Púng Bánh",
        "type": "xa"
      },
      {
        "code": "5671",
        "name": "Xã Quỳnh Nhai",
        "type": "xa"
      },
      {
        "code": "4903",
        "name": "Xã Song Khủa",
        "type": "xa"
      },
      {
        "code": "17959",
        "name": "Xã Sông Mã",
        "type": "xa"
      },
      {
        "code": "18727",
        "name": "Xã Sốp Cộp",
        "type": "xa"
      },
      {
        "code": "1063",
        "name": "Xã Suối Tọ",
        "type": "xa"
      },
      {
        "code": "15911",
        "name": "Xã Tà Hộc",
        "type": "xa"
      },
      {
        "code": "10535",
        "name": "Xã Tạ Khoa",
        "type": "xa"
      },
      {
        "code": "10279",
        "name": "Xã Tà Xùa",
        "type": "xa"
      },
      {
        "code": "12839",
        "name": "Xã Tân Phong",
        "type": "xa"
      },
      {
        "code": "1575",
        "name": "Xã Tân Yên",
        "type": "xa"
      },
      {
        "code": "6695",
        "name": "Xã Thuận Châu",
        "type": "xa"
      },
      {
        "code": "5159",
        "name": "Xã Tô Múa",
        "type": "xa"
      },
      {
        "code": "12071",
        "name": "Xã Tường Hạ",
        "type": "xa"
      },
      {
        "code": "4647",
        "name": "Xã Vân Hồ",
        "type": "xa"
      },
      {
        "code": "10791",
        "name": "Xã Xím Vàng",
        "type": "xa"
      },
      {
        "code": "5415",
        "name": "Xã Xuân Nha",
        "type": "xa"
      },
      {
        "code": "13351",
        "name": "Xã Yên Châu",
        "type": "xa"
      },
      {
        "code": "14119",
        "name": "Xã Yên Sơn",
        "type": "xa"
      }
    ]
  },
  {
    "code": "40",
    "name": "Tây Ninh",
    "wards": [
      {
        "code": "7464",
        "name": "Phường An Tịnh",
        "type": "phuong"
      },
      {
        "code": "2856",
        "name": "Phường Bình Minh",
        "type": "phuong"
      },
      {
        "code": "7976",
        "name": "Phường Gia Lộc",
        "type": "phuong"
      },
      {
        "code": "7720",
        "name": "Phường Gò Dầu",
        "type": "phuong"
      },
      {
        "code": "6696",
        "name": "Phường Hòa Thành",
        "type": "phuong"
      },
      {
        "code": "24616",
        "name": "Phường Khánh Hậu",
        "type": "phuong"
      },
      {
        "code": "13864",
        "name": "Phường Kiến Tường",
        "type": "phuong"
      },
      {
        "code": "4392",
        "name": "Phường Long An",
        "type": "phuong"
      },
      {
        "code": "6440",
        "name": "Phường Long Hoa",
        "type": "phuong"
      },
      {
        "code": "552",
        "name": "Phường Ninh Thạnh",
        "type": "phuong"
      },
      {
        "code": "24360",
        "name": "Phường Tân An",
        "type": "phuong"
      },
      {
        "code": "2600",
        "name": "Phường Tân Ninh",
        "type": "phuong"
      },
      {
        "code": "6952",
        "name": "Phường Thanh Điền",
        "type": "phuong"
      },
      {
        "code": "7208",
        "name": "Phường Trảng Bàng",
        "type": "phuong"
      },
      {
        "code": "23592",
        "name": "Xã An Lục Long",
        "type": "xa"
      },
      {
        "code": "17704",
        "name": "Xã An Ninh",
        "type": "xa"
      },
      {
        "code": "12328",
        "name": "Xã Bến Cầu",
        "type": "xa"
      },
      {
        "code": "19496",
        "name": "Xã Bến Lức",
        "type": "xa"
      },
      {
        "code": "19240",
        "name": "Xã Bình Đức",
        "type": "xa"
      },
      {
        "code": "13608",
        "name": "Xã Bình Hiệp",
        "type": "xa"
      },
      {
        "code": "14120",
        "name": "Xã Bình Hòa",
        "type": "xa"
      },
      {
        "code": "15400",
        "name": "Xã Bình Thành",
        "type": "xa"
      },
      {
        "code": "21032",
        "name": "Xã Cần Đước",
        "type": "xa"
      },
      {
        "code": "22056",
        "name": "Xã Cần Giuộc",
        "type": "xa"
      },
      {
        "code": "808",
        "name": "Xã Cầu Khởi",
        "type": "xa"
      },
      {
        "code": "3112",
        "name": "Xã Châu Thành",
        "type": "xa"
      },
      {
        "code": "296",
        "name": "Xã Dương Minh Châu",
        "type": "xa"
      },
      {
        "code": "17192",
        "name": "Xã Đông Thành",
        "type": "xa"
      },
      {
        "code": "18728",
        "name": "Xã Đức Hòa",
        "type": "xa"
      },
      {
        "code": "17448",
        "name": "Xã Đức Huệ",
        "type": "xa"
      },
      {
        "code": "3368",
        "name": "Xã Đức Lập",
        "type": "xa"
      },
      {
        "code": "11560",
        "name": "Xã Hảo Đước",
        "type": "xa"
      },
      {
        "code": "18216",
        "name": "Xã Hậu Nghĩa",
        "type": "xa"
      },
      {
        "code": "4136",
        "name": "Xã Hậu Thạnh",
        "type": "xa"
      },
      {
        "code": "17960",
        "name": "Xã Hiệp Hòa",
        "type": "xa"
      },
      {
        "code": "11048",
        "name": "Xã Hòa Hội",
        "type": "xa"
      },
      {
        "code": "18472",
        "name": "Xã Hòa Khánh",
        "type": "xa"
      },
      {
        "code": "12584",
        "name": "Xã Hưng Điền",
        "type": "xa"
      },
      {
        "code": "8232",
        "name": "Xã Hưng Thuận",
        "type": "xa"
      },
      {
        "code": "5160",
        "name": "Xã Khánh Hưng",
        "type": "xa"
      },
      {
        "code": "20008",
        "name": "Xã Long Cang",
        "type": "xa"
      },
      {
        "code": "11816",
        "name": "Xã Long Chữ",
        "type": "xa"
      },
      {
        "code": "21288",
        "name": "Xã Long Hựu",
        "type": "xa"
      },
      {
        "code": "12072",
        "name": "Xã Long Thuận",
        "type": "xa"
      },
      {
        "code": "1064",
        "name": "Xã Lộc Ninh",
        "type": "xa"
      },
      {
        "code": "6184",
        "name": "Xã Lương Hòa",
        "type": "xa"
      },
      {
        "code": "14376",
        "name": "Xã Mộc Hóa",
        "type": "xa"
      },
      {
        "code": "16424",
        "name": "Xã Mỹ An",
        "type": "xa"
      },
      {
        "code": "3624",
        "name": "Xã Mỹ Hạnh",
        "type": "xa"
      },
      {
        "code": "20520",
        "name": "Xã Mỹ Lệ",
        "type": "xa"
      },
      {
        "code": "21800",
        "name": "Xã Mỹ Lộc",
        "type": "xa"
      },
      {
        "code": "16936",
        "name": "Xã Mỹ Quý",
        "type": "xa"
      },
      {
        "code": "4648",
        "name": "Xã Mỹ Thạnh",
        "type": "xa"
      },
      {
        "code": "19752",
        "name": "Xã Mỹ Yên",
        "type": "xa"
      },
      {
        "code": "14632",
        "name": "Xã Nhơn Hòa Lập",
        "type": "xa"
      },
      {
        "code": "14888",
        "name": "Xã Nhơn Ninh",
        "type": "xa"
      },
      {
        "code": "5672",
        "name": "Xã Nhựt Tảo",
        "type": "xa"
      },
      {
        "code": "11304",
        "name": "Xã Ninh Điền",
        "type": "xa"
      },
      {
        "code": "8488",
        "name": "Xã Phước Chỉ",
        "type": "xa"
      },
      {
        "code": "21544",
        "name": "Xã Phước Lý",
        "type": "xa"
      },
      {
        "code": "9000",
        "name": "Xã Phước Thạnh",
        "type": "xa"
      },
      {
        "code": "10792",
        "name": "Xã Phước Vinh",
        "type": "xa"
      },
      {
        "code": "22312",
        "name": "Xã Phước Vĩnh Tây",
        "type": "xa"
      },
      {
        "code": "20264",
        "name": "Xã Rạch Kiến",
        "type": "xa"
      },
      {
        "code": "23848",
        "name": "Xã Tầm Vu",
        "type": "xa"
      },
      {
        "code": "10536",
        "name": "Xã Tân Biên",
        "type": "xa"
      },
      {
        "code": "1832",
        "name": "Xã Tân Châu",
        "type": "xa"
      },
      {
        "code": "9512",
        "name": "Xã Tân Đông",
        "type": "xa"
      },
      {
        "code": "10024",
        "name": "Xã Tân Hòa",
        "type": "xa"
      },
      {
        "code": "9768",
        "name": "Xã Tân Hội",
        "type": "xa"
      },
      {
        "code": "13096",
        "name": "Xã Tân Hưng",
        "type": "xa"
      },
      {
        "code": "20776",
        "name": "Xã Tân Lân",
        "type": "xa"
      },
      {
        "code": "10280",
        "name": "Xã Tân Lập",
        "type": "xa"
      },
      {
        "code": "16680",
        "name": "Xã Tân Long",
        "type": "xa"
      },
      {
        "code": "2344",
        "name": "Xã Tân Phú",
        "type": "xa"
      },
      {
        "code": "22568",
        "name": "Xã Tân Tập",
        "type": "xa"
      },
      {
        "code": "16168",
        "name": "Xã Tân Tây",
        "type": "xa"
      },
      {
        "code": "2088",
        "name": "Xã Tân Thành",
        "type": "xa"
      },
      {
        "code": "15144",
        "name": "Xã Tân Thạnh",
        "type": "xa"
      },
      {
        "code": "23080",
        "name": "Xã Tân Trụ",
        "type": "xa"
      },
      {
        "code": "1320",
        "name": "Xã Thạnh Bình",
        "type": "xa"
      },
      {
        "code": "8744",
        "name": "Xã Thạnh Đức",
        "type": "xa"
      },
      {
        "code": "15912",
        "name": "Xã Thạnh Hóa",
        "type": "xa"
      },
      {
        "code": "18984",
        "name": "Xã Thạnh Lợi",
        "type": "xa"
      },
      {
        "code": "15656",
        "name": "Xã Thạnh Phước",
        "type": "xa"
      },
      {
        "code": "5928",
        "name": "Xã Thủ Thừa",
        "type": "xa"
      },
      {
        "code": "23336",
        "name": "Xã Thuận Mỹ",
        "type": "xa"
      },
      {
        "code": "1576",
        "name": "Xã Trà Vong",
        "type": "xa"
      },
      {
        "code": "9256",
        "name": "Xã Truông Mít",
        "type": "xa"
      },
      {
        "code": "5416",
        "name": "Xã Tuyên Bình",
        "type": "xa"
      },
      {
        "code": "3880",
        "name": "Xã Tuyên Thạnh",
        "type": "xa"
      },
      {
        "code": "22824",
        "name": "Xã Vàm Cỏ",
        "type": "xa"
      },
      {
        "code": "13352",
        "name": "Xã Vĩnh Châu",
        "type": "xa"
      },
      {
        "code": "24104",
        "name": "Xã Vĩnh Công",
        "type": "xa"
      },
      {
        "code": "4904",
        "name": "Xã Vĩnh Hưng",
        "type": "xa"
      },
      {
        "code": "12840",
        "name": "Xã Vĩnh Thạnh",
        "type": "xa"
      }
    ]
  },
  {
    "code": "41",
    "name": "Thái Nguyên",
    "wards": [
      {
        "code": "5417",
        "name": "Phường Bá Xuyên",
        "type": "phuong"
      },
      {
        "code": "5673",
        "name": "Phường Bách Quang",
        "type": "phuong"
      },
      {
        "code": "20777",
        "name": "Phường Bắc Kạn",
        "type": "phuong"
      },
      {
        "code": "20521",
        "name": "Phường Đức Xuân",
        "type": "phuong"
      },
      {
        "code": "1321",
        "name": "Phường Gia Sàng",
        "type": "phuong"
      },
      {
        "code": "2089",
        "name": "Phường Linh Sơn",
        "type": "phuong"
      },
      {
        "code": "1577",
        "name": "Phường Phan Đình Phùng",
        "type": "phuong"
      },
      {
        "code": "13865",
        "name": "Phường Phổ Yên",
        "type": "phuong"
      },
      {
        "code": "2345",
        "name": "Phường Phúc Thuận",
        "type": "phuong"
      },
      {
        "code": "10793",
        "name": "Phường Quan Triều",
        "type": "phuong"
      },
      {
        "code": "10537",
        "name": "Phường Quyết Thắng",
        "type": "phuong"
      },
      {
        "code": "5161",
        "name": "Phường Sông Công",
        "type": "phuong"
      },
      {
        "code": "1833",
        "name": "Phường Tích Lương",
        "type": "phuong"
      },
      {
        "code": "14377",
        "name": "Phường Trung Thành",
        "type": "phuong"
      },
      {
        "code": "14121",
        "name": "Phường Vạn Xuân",
        "type": "phuong"
      },
      {
        "code": "12841",
        "name": "Xã An Khánh",
        "type": "xa"
      },
      {
        "code": "16425",
        "name": "Xã Ba Bể",
        "type": "xa"
      },
      {
        "code": "20009",
        "name": "Xã Bạch Thông",
        "type": "xa"
      },
      {
        "code": "15657",
        "name": "Xã Bằng Thành",
        "type": "xa"
      },
      {
        "code": "15401",
        "name": "Xã Bằng Vân",
        "type": "xa"
      },
      {
        "code": "8233",
        "name": "Xã Bình Thành",
        "type": "xa"
      },
      {
        "code": "7209",
        "name": "Xã Bình Yên",
        "type": "xa"
      },
      {
        "code": "16169",
        "name": "Xã Cao Minh",
        "type": "xa"
      },
      {
        "code": "19497",
        "name": "Xã Cẩm Giàng",
        "type": "xa"
      },
      {
        "code": "18473",
        "name": "Xã Chợ Đồn",
        "type": "xa"
      },
      {
        "code": "23337",
        "name": "Xã Chợ Mới",
        "type": "xa"
      },
      {
        "code": "16681",
        "name": "Xã Chợ Rã",
        "type": "xa"
      },
      {
        "code": "22057",
        "name": "Xã Côn Minh",
        "type": "xa"
      },
      {
        "code": "21289",
        "name": "Xã Cường Lợi",
        "type": "xa"
      },
      {
        "code": "9257",
        "name": "Xã Dân Tiến",
        "type": "xa"
      },
      {
        "code": "11305",
        "name": "Xã Đại Phúc",
        "type": "xa"
      },
      {
        "code": "11561",
        "name": "Xã Đại Từ",
        "type": "xa"
      },
      {
        "code": "1065",
        "name": "Xã Điềm Thụy",
        "type": "xa"
      },
      {
        "code": "6953",
        "name": "Xã Định Hóa",
        "type": "xa"
      },
      {
        "code": "3625",
        "name": "Xã Đồng Hỷ",
        "type": "xa"
      },
      {
        "code": "15145",
        "name": "Xã Đồng Phúc",
        "type": "xa"
      },
      {
        "code": "11817",
        "name": "Xã Đức Lương",
        "type": "xa"
      },
      {
        "code": "17449",
        "name": "Xã Hiệp Lực",
        "type": "xa"
      },
      {
        "code": "6697",
        "name": "Xã Hợp Thành",
        "type": "xa"
      },
      {
        "code": "3113",
        "name": "Xã Kha Sơn",
        "type": "xa"
      },
      {
        "code": "8489",
        "name": "Xã Kim Phượng",
        "type": "xa"
      },
      {
        "code": "12329",
        "name": "Xã La Bằng",
        "type": "xa"
      },
      {
        "code": "10025",
        "name": "Xã La Hiên",
        "type": "xa"
      },
      {
        "code": "8745",
        "name": "Xã Lam Vỹ",
        "type": "xa"
      },
      {
        "code": "17193",
        "name": "Xã Nà Phặc",
        "type": "xa"
      },
      {
        "code": "21545",
        "name": "Xã Na Rì",
        "type": "xa"
      },
      {
        "code": "17705",
        "name": "Xã Nam Cường",
        "type": "xa"
      },
      {
        "code": "4393",
        "name": "Xã Nam Hòa",
        "type": "xa"
      },
      {
        "code": "16937",
        "name": "Xã Ngân Sơn",
        "type": "xa"
      },
      {
        "code": "18985",
        "name": "Xã Nghĩa Tá",
        "type": "xa"
      },
      {
        "code": "15913",
        "name": "Xã Nghiên Loan",
        "type": "xa"
      },
      {
        "code": "9513",
        "name": "Xã Nghinh Tường",
        "type": "xa"
      },
      {
        "code": "20265",
        "name": "Xã Phong Quang",
        "type": "xa"
      },
      {
        "code": "809",
        "name": "Xã Phú Bình",
        "type": "xa"
      },
      {
        "code": "7977",
        "name": "Xã Phú Đình",
        "type": "xa"
      },
      {
        "code": "12585",
        "name": "Xã Phú Lạc",
        "type": "xa"
      },
      {
        "code": "5929",
        "name": "Xã Phú Lương",
        "type": "xa"
      },
      {
        "code": "12073",
        "name": "Xã Phú Thịnh",
        "type": "xa"
      },
      {
        "code": "19241",
        "name": "Xã Phủ Thông",
        "type": "xa"
      },
      {
        "code": "13609",
        "name": "Xã Phú Xuyên",
        "type": "xa"
      },
      {
        "code": "14633",
        "name": "Xã Phúc Lộc",
        "type": "xa"
      },
      {
        "code": "7721",
        "name": "Xã Phượng Tiến",
        "type": "xa"
      },
      {
        "code": "17961",
        "name": "Xã Quảng Bạch",
        "type": "xa"
      },
      {
        "code": "3881",
        "name": "Xã Quang Sơn",
        "type": "xa"
      },
      {
        "code": "13097",
        "name": "Xã Quân Chu",
        "type": "xa"
      },
      {
        "code": "553",
        "name": "Xã Sảng Mộc",
        "type": "xa"
      },
      {
        "code": "11049",
        "name": "Xã Tân Cương",
        "type": "xa"
      },
      {
        "code": "3369",
        "name": "Xã Tân Khánh",
        "type": "xa"
      },
      {
        "code": "22569",
        "name": "Xã Tân Kỳ",
        "type": "xa"
      },
      {
        "code": "2857",
        "name": "Xã Tân Thành",
        "type": "xa"
      },
      {
        "code": "2601",
        "name": "Xã Thành Công",
        "type": "xa"
      },
      {
        "code": "22825",
        "name": "Xã Thanh Mai",
        "type": "xa"
      },
      {
        "code": "23081",
        "name": "Xã Thanh Thịnh",
        "type": "xa"
      },
      {
        "code": "9769",
        "name": "Xã Thần Sa",
        "type": "xa"
      },
      {
        "code": "14889",
        "name": "Xã Thượng Minh",
        "type": "xa"
      },
      {
        "code": "297",
        "name": "Xã Thượng Quan",
        "type": "xa"
      },
      {
        "code": "4137",
        "name": "Xã Trại Cau",
        "type": "xa"
      },
      {
        "code": "10281",
        "name": "Xã Tràng Xá",
        "type": "xa"
      },
      {
        "code": "21801",
        "name": "Xã Trần Phú",
        "type": "xa"
      },
      {
        "code": "7465",
        "name": "Xã Trung Hội",
        "type": "xa"
      },
      {
        "code": "13353",
        "name": "Xã Vạn Phú",
        "type": "xa"
      },
      {
        "code": "4649",
        "name": "Xã Văn Hán",
        "type": "xa"
      },
      {
        "code": "21033",
        "name": "Xã Văn Lang",
        "type": "xa"
      },
      {
        "code": "4905",
        "name": "Xã Văn Lăng",
        "type": "xa"
      },
      {
        "code": "19753",
        "name": "Xã Vĩnh Thông",
        "type": "xa"
      },
      {
        "code": "9001",
        "name": "Xã Võ Nhai",
        "type": "xa"
      },
      {
        "code": "6185",
        "name": "Xã Vô Tranh",
        "type": "xa"
      },
      {
        "code": "22313",
        "name": "Xã Xuân Dương",
        "type": "xa"
      },
      {
        "code": "23593",
        "name": "Xã Yên Bình",
        "type": "xa"
      },
      {
        "code": "18729",
        "name": "Xã Yên Phong",
        "type": "xa"
      },
      {
        "code": "18217",
        "name": "Xã Yên Thịnh",
        "type": "xa"
      },
      {
        "code": "6441",
        "name": "Xã Yên Trạch",
        "type": "xa"
      }
    ]
  },
  {
    "code": "42",
    "name": "Thanh Hóa",
    "wards": [
      {
        "code": "11306",
        "name": "Phường Bỉm Sơn",
        "type": "phuong"
      },
      {
        "code": "12842",
        "name": "Phường Đào Duy Từ",
        "type": "phuong"
      },
      {
        "code": "9514",
        "name": "Phường Đông Quang",
        "type": "phuong"
      },
      {
        "code": "10026",
        "name": "Phường Đông Sơn",
        "type": "phuong"
      },
      {
        "code": "10282",
        "name": "Phường Đông Tiến",
        "type": "phuong"
      },
      {
        "code": "41514",
        "name": "Phường Hạc Thành",
        "type": "phuong"
      },
      {
        "code": "7978",
        "name": "Phường Hải Bình",
        "type": "phuong"
      },
      {
        "code": "12330",
        "name": "Phường Hải Lĩnh",
        "type": "phuong"
      },
      {
        "code": "8746",
        "name": "Phường Hàm Rồng",
        "type": "phuong"
      },
      {
        "code": "11050",
        "name": "Phường Nam Sầm Sơn",
        "type": "phuong"
      },
      {
        "code": "13354",
        "name": "Phường Nghi Sơn",
        "type": "phuong"
      },
      {
        "code": "11818",
        "name": "Phường Ngọc Sơn",
        "type": "phuong"
      },
      {
        "code": "10538",
        "name": "Phường Nguyệt Viên",
        "type": "phuong"
      },
      {
        "code": "9770",
        "name": "Phường Quảng Phú",
        "type": "phuong"
      },
      {
        "code": "11562",
        "name": "Phường Quang Trung",
        "type": "phuong"
      },
      {
        "code": "10794",
        "name": "Phường Sầm Sơn",
        "type": "phuong"
      },
      {
        "code": "12074",
        "name": "Phường Tân Dân",
        "type": "phuong"
      },
      {
        "code": "12586",
        "name": "Phường Tĩnh Gia",
        "type": "phuong"
      },
      {
        "code": "13098",
        "name": "Phường Trúc Lâm",
        "type": "phuong"
      },
      {
        "code": "28714",
        "name": "Xã An Nông",
        "type": "xa"
      },
      {
        "code": "17194",
        "name": "Xã Ba Đình",
        "type": "xa"
      },
      {
        "code": "32298",
        "name": "Xã Bá Thước",
        "type": "xa"
      },
      {
        "code": "6698",
        "name": "Xã Bát Mọt",
        "type": "xa"
      },
      {
        "code": "27434",
        "name": "Xã Biện Thượng",
        "type": "xa"
      },
      {
        "code": "13610",
        "name": "Xã Các Sơn",
        "type": "xa"
      },
      {
        "code": "36906",
        "name": "Xã Cẩm Tân",
        "type": "xa"
      },
      {
        "code": "35882",
        "name": "Xã Cẩm Thạch",
        "type": "xa"
      },
      {
        "code": "36138",
        "name": "Xã Cẩm Thủy",
        "type": "xa"
      },
      {
        "code": "36394",
        "name": "Xã Cẩm Tú",
        "type": "xa"
      },
      {
        "code": "36650",
        "name": "Xã Cẩm Vân",
        "type": "xa"
      },
      {
        "code": "33834",
        "name": "Xã Cổ Lũng",
        "type": "xa"
      },
      {
        "code": "3882",
        "name": "Xã Công Chính",
        "type": "xa"
      },
      {
        "code": "33322",
        "name": "Xã Điền Lư",
        "type": "xa"
      },
      {
        "code": "33066",
        "name": "Xã Điền Quang",
        "type": "xa"
      },
      {
        "code": "8490",
        "name": "Xã Định Hòa",
        "type": "xa"
      },
      {
        "code": "24618",
        "name": "Xã Định Tân",
        "type": "xa"
      },
      {
        "code": "31530",
        "name": "Xã Đồng Lương",
        "type": "xa"
      },
      {
        "code": "15146",
        "name": "Xã Đông Thành",
        "type": "xa"
      },
      {
        "code": "29226",
        "name": "Xã Đồng Tiến",
        "type": "xa"
      },
      {
        "code": "32042",
        "name": "Xã Giao An",
        "type": "xa"
      },
      {
        "code": "14378",
        "name": "Xã Hà Long",
        "type": "xa"
      },
      {
        "code": "41770",
        "name": "Xã Hà Trung",
        "type": "xa"
      },
      {
        "code": "15402",
        "name": "Xã Hậu Lộc",
        "type": "xa"
      },
      {
        "code": "30250",
        "name": "Xã Hiền Kiệt",
        "type": "xa"
      },
      {
        "code": "15658",
        "name": "Xã Hoa Lộc",
        "type": "xa"
      },
      {
        "code": "39210",
        "name": "Xã Hóa Quỳ",
        "type": "xa"
      },
      {
        "code": "9002",
        "name": "Xã Hoạt Giang",
        "type": "xa"
      },
      {
        "code": "18474",
        "name": "Xã Hoằng Châu",
        "type": "xa"
      },
      {
        "code": "19242",
        "name": "Xã Hoằng Giang",
        "type": "xa"
      },
      {
        "code": "17450",
        "name": "Xã Hoằng Hóa",
        "type": "xa"
      },
      {
        "code": "18218",
        "name": "Xã Hoằng Lộc",
        "type": "xa"
      },
      {
        "code": "18986",
        "name": "Xã Hoằng Phú",
        "type": "xa"
      },
      {
        "code": "18730",
        "name": "Xã Hoằng Sơn",
        "type": "xa"
      },
      {
        "code": "17962",
        "name": "Xã Hoằng Thanh",
        "type": "xa"
      },
      {
        "code": "17706",
        "name": "Xã Hoằng Tiến",
        "type": "xa"
      },
      {
        "code": "16426",
        "name": "Xã Hồ Vương",
        "type": "xa"
      },
      {
        "code": "29482",
        "name": "Xã Hồi Xuân",
        "type": "xa"
      },
      {
        "code": "28458",
        "name": "Xã Hợp Tiến",
        "type": "xa"
      },
      {
        "code": "35626",
        "name": "Xã Kiên Thọ",
        "type": "xa"
      },
      {
        "code": "37162",
        "name": "Xã Kim Tân",
        "type": "xa"
      },
      {
        "code": "25898",
        "name": "Xã Lam Sơn",
        "type": "xa"
      },
      {
        "code": "31274",
        "name": "Xã Linh Sơn",
        "type": "xa"
      },
      {
        "code": "14634",
        "name": "Xã Lĩnh Toại",
        "type": "xa"
      },
      {
        "code": "6954",
        "name": "Xã Luận Thành",
        "type": "xa"
      },
      {
        "code": "7210",
        "name": "Xã Lương Sơn",
        "type": "xa"
      },
      {
        "code": "19498",
        "name": "Xã Lưu Vệ",
        "type": "xa"
      },
      {
        "code": "40490",
        "name": "Xã Mậu Lâm",
        "type": "xa"
      },
      {
        "code": "35114",
        "name": "Xã Minh Sơn",
        "type": "xa"
      },
      {
        "code": "6186",
        "name": "Xã Mường Chanh",
        "type": "xa"
      },
      {
        "code": "5930",
        "name": "Xã Mường Lát",
        "type": "xa"
      },
      {
        "code": "5162",
        "name": "Xã Mường Lý",
        "type": "xa"
      },
      {
        "code": "1322",
        "name": "Xã Mường Mìn",
        "type": "xa"
      },
      {
        "code": "1578",
        "name": "Xã Na Mèo",
        "type": "xa"
      },
      {
        "code": "29738",
        "name": "Xã Nam Xuân",
        "type": "xa"
      },
      {
        "code": "16938",
        "name": "Xã Nga An",
        "type": "xa"
      },
      {
        "code": "15914",
        "name": "Xã Nga Sơn",
        "type": "xa"
      },
      {
        "code": "16170",
        "name": "Xã Nga Thắng",
        "type": "xa"
      },
      {
        "code": "34346",
        "name": "Xã Ngọc Lặc",
        "type": "xa"
      },
      {
        "code": "34858",
        "name": "Xã Ngọc Liên",
        "type": "xa"
      },
      {
        "code": "37674",
        "name": "Xã Ngọc Trạo",
        "type": "xa"
      },
      {
        "code": "35370",
        "name": "Xã Nguyệt Ấn",
        "type": "xa"
      },
      {
        "code": "3370",
        "name": "Xã Nhi Sơn",
        "type": "xa"
      },
      {
        "code": "42538",
        "name": "Xã Như Thanh",
        "type": "xa"
      },
      {
        "code": "38698",
        "name": "Xã Như Xuân",
        "type": "xa"
      },
      {
        "code": "21290",
        "name": "Xã Nông Cống",
        "type": "xa"
      },
      {
        "code": "30506",
        "name": "Xã Phú Lệ",
        "type": "xa"
      },
      {
        "code": "4138",
        "name": "Xã Phú Xuân",
        "type": "xa"
      },
      {
        "code": "34090",
        "name": "Xã Pù Luông",
        "type": "xa"
      },
      {
        "code": "3626",
        "name": "Xã Pù Nhi",
        "type": "xa"
      },
      {
        "code": "42282",
        "name": "Xã Quan Sơn",
        "type": "xa"
      },
      {
        "code": "20522",
        "name": "Xã Quảng Bình",
        "type": "xa"
      },
      {
        "code": "2858",
        "name": "Xã Quang Chiểu",
        "type": "xa"
      },
      {
        "code": "21034",
        "name": "Xã Quảng Chính",
        "type": "xa"
      },
      {
        "code": "20010",
        "name": "Xã Quảng Ngọc",
        "type": "xa"
      },
      {
        "code": "20266",
        "name": "Xã Quảng Ninh",
        "type": "xa"
      },
      {
        "code": "19754",
        "name": "Xã Quảng Yên",
        "type": "xa"
      },
      {
        "code": "24106",
        "name": "Xã Quý Lộc",
        "type": "xa"
      },
      {
        "code": "33578",
        "name": "Xã Quý Lương",
        "type": "xa"
      },
      {
        "code": "25642",
        "name": "Xã Sao Vàng",
        "type": "xa"
      },
      {
        "code": "1834",
        "name": "Xã Sơn Điện",
        "type": "xa"
      },
      {
        "code": "2090",
        "name": "Xã Sơn Thủy",
        "type": "xa"
      },
      {
        "code": "3114",
        "name": "Xã Tam Chung",
        "type": "xa"
      },
      {
        "code": "2346",
        "name": "Xã Tam Lư",
        "type": "xa"
      },
      {
        "code": "2602",
        "name": "Xã Tam Thanh",
        "type": "xa"
      },
      {
        "code": "28970",
        "name": "Xã Tân Ninh",
        "type": "xa"
      },
      {
        "code": "7722",
        "name": "Xã Tân Thành",
        "type": "xa"
      },
      {
        "code": "16682",
        "name": "Xã Tân Tiến",
        "type": "xa"
      },
      {
        "code": "27178",
        "name": "Xã Tây Đô",
        "type": "xa"
      },
      {
        "code": "37930",
        "name": "Xã Thạch Bình",
        "type": "xa"
      },
      {
        "code": "34602",
        "name": "Xã Thạch Lập",
        "type": "xa"
      },
      {
        "code": "38442",
        "name": "Xã Thạch Quảng",
        "type": "xa"
      },
      {
        "code": "4394",
        "name": "Xã Thanh Kỳ",
        "type": "xa"
      },
      {
        "code": "39722",
        "name": "Xã Thanh Phong",
        "type": "xa"
      },
      {
        "code": "39978",
        "name": "Xã Thanh Quân",
        "type": "xa"
      },
      {
        "code": "38186",
        "name": "Xã Thành Vinh",
        "type": "xa"
      },
      {
        "code": "22314",
        "name": "Xã Thăng Bình",
        "type": "xa"
      },
      {
        "code": "41002",
        "name": "Xã Thắng Lộc",
        "type": "xa"
      },
      {
        "code": "21546",
        "name": "Xã Thắng Lợi",
        "type": "xa"
      },
      {
        "code": "29994",
        "name": "Xã Thiên Phủ",
        "type": "xa"
      },
      {
        "code": "32554",
        "name": "Xã Thiết Ống",
        "type": "xa"
      },
      {
        "code": "42026",
        "name": "Xã Thiệu Hóa",
        "type": "xa"
      },
      {
        "code": "298",
        "name": "Xã Thiệu Quang",
        "type": "xa"
      },
      {
        "code": "22826",
        "name": "Xã Thiệu Tiến",
        "type": "xa"
      },
      {
        "code": "23082",
        "name": "Xã Thiệu Toán",
        "type": "xa"
      },
      {
        "code": "6442",
        "name": "Xã Thiệu Trung",
        "type": "xa"
      },
      {
        "code": "27946",
        "name": "Xã Thọ Bình",
        "type": "xa"
      },
      {
        "code": "26154",
        "name": "Xã Thọ Lập",
        "type": "xa"
      },
      {
        "code": "25130",
        "name": "Xã Thọ Long",
        "type": "xa"
      },
      {
        "code": "28202",
        "name": "Xã Thọ Ngọc",
        "type": "xa"
      },
      {
        "code": "554",
        "name": "Xã Thọ Phú",
        "type": "xa"
      },
      {
        "code": "24874",
        "name": "Xã Thọ Xuân",
        "type": "xa"
      },
      {
        "code": "38954",
        "name": "Xã Thượng Ninh",
        "type": "xa"
      },
      {
        "code": "40746",
        "name": "Xã Thường Xuân",
        "type": "xa"
      },
      {
        "code": "20778",
        "name": "Xã Tiên Trang",
        "type": "xa"
      },
      {
        "code": "14122",
        "name": "Xã Tống Sơn",
        "type": "xa"
      },
      {
        "code": "14890",
        "name": "Xã Triệu Lộc",
        "type": "xa"
      },
      {
        "code": "27690",
        "name": "Xã Triệu Sơn",
        "type": "xa"
      },
      {
        "code": "21802",
        "name": "Xã Trung Chính",
        "type": "xa"
      },
      {
        "code": "31018",
        "name": "Xã Trung Hạ",
        "type": "xa"
      },
      {
        "code": "810",
        "name": "Xã Trung Lý",
        "type": "xa"
      },
      {
        "code": "1066",
        "name": "Xã Trung Sơn",
        "type": "xa"
      },
      {
        "code": "30762",
        "name": "Xã Trung Thành",
        "type": "xa"
      },
      {
        "code": "13866",
        "name": "Xã Trường Lâm",
        "type": "xa"
      },
      {
        "code": "22058",
        "name": "Xã Trường Văn",
        "type": "xa"
      },
      {
        "code": "22570",
        "name": "Xã Tượng Lĩnh",
        "type": "xa"
      },
      {
        "code": "9258",
        "name": "Xã Vạn Lộc",
        "type": "xa"
      },
      {
        "code": "7466",
        "name": "Xã Vạn Xuân",
        "type": "xa"
      },
      {
        "code": "32810",
        "name": "Xã Văn Nho",
        "type": "xa"
      },
      {
        "code": "31786",
        "name": "Xã Văn Phú",
        "type": "xa"
      },
      {
        "code": "37418",
        "name": "Xã Vân Du",
        "type": "xa"
      },
      {
        "code": "26922",
        "name": "Xã Vĩnh Lộc",
        "type": "xa"
      },
      {
        "code": "39466",
        "name": "Xã Xuân Bình",
        "type": "xa"
      },
      {
        "code": "41258",
        "name": "Xã Xuân Chinh",
        "type": "xa"
      },
      {
        "code": "40234",
        "name": "Xã Xuân Du",
        "type": "xa"
      },
      {
        "code": "25386",
        "name": "Xã Xuân Hòa",
        "type": "xa"
      },
      {
        "code": "26666",
        "name": "Xã Xuân Lập",
        "type": "xa"
      },
      {
        "code": "4650",
        "name": "Xã Xuân Thái",
        "type": "xa"
      },
      {
        "code": "26410",
        "name": "Xã Xuân Tín",
        "type": "xa"
      },
      {
        "code": "23338",
        "name": "Xã Yên Định",
        "type": "xa"
      },
      {
        "code": "5418",
        "name": "Xã Yên Khương",
        "type": "xa"
      },
      {
        "code": "8234",
        "name": "Xã Yên Nhân",
        "type": "xa"
      },
      {
        "code": "24362",
        "name": "Xã Yên Ninh",
        "type": "xa"
      },
      {
        "code": "23850",
        "name": "Xã Yên Phú",
        "type": "xa"
      },
      {
        "code": "5674",
        "name": "Xã Yên Thắng",
        "type": "xa"
      },
      {
        "code": "4906",
        "name": "Xã Yên Thọ",
        "type": "xa"
      },
      {
        "code": "23594",
        "name": "Xã Yên Trường",
        "type": "xa"
      }
    ]
  },
  {
    "code": "15",
    "name": "TP. Cần Thơ",
    "wards": [
      {
        "code": "2575",
        "name": "Phường An Bình",
        "type": "phuong"
      },
      {
        "code": "15887",
        "name": "Phường Bình Thủy",
        "type": "phuong"
      },
      {
        "code": "2319",
        "name": "Phường Cái Khế",
        "type": "phuong"
      },
      {
        "code": "3855",
        "name": "Phường Cái Răng",
        "type": "phuong"
      },
      {
        "code": "13583",
        "name": "Phường Đại Thành",
        "type": "phuong"
      },
      {
        "code": "4111",
        "name": "Phường Hưng Phú",
        "type": "phuong"
      },
      {
        "code": "18959",
        "name": "Phường Khánh Hòa",
        "type": "phuong"
      },
      {
        "code": "11279",
        "name": "Phường Long Bình",
        "type": "phuong"
      },
      {
        "code": "11535",
        "name": "Phường Long Mỹ",
        "type": "phuong"
      },
      {
        "code": "11791",
        "name": "Phường Long Phú 1",
        "type": "phuong"
      },
      {
        "code": "2063",
        "name": "Phường Long Tuyền",
        "type": "phuong"
      },
      {
        "code": "19471",
        "name": "Phường Mỹ Quới",
        "type": "phuong"
      },
      {
        "code": "24079",
        "name": "Phường Mỹ Xuyên",
        "type": "phuong"
      },
      {
        "code": "13839",
        "name": "Phường Ngã Bảy",
        "type": "phuong"
      },
      {
        "code": "19215",
        "name": "Phường Ngã Năm",
        "type": "phuong"
      },
      {
        "code": "3087",
        "name": "Phường Ninh Kiều",
        "type": "phuong"
      },
      {
        "code": "4367",
        "name": "Phường Ô Môn",
        "type": "phuong"
      },
      {
        "code": "23567",
        "name": "Phường Phú Lợi",
        "type": "phuong"
      },
      {
        "code": "4879",
        "name": "Phường Phước Thới",
        "type": "phuong"
      },
      {
        "code": "23823",
        "name": "Phường Sóc Trăng",
        "type": "phuong"
      },
      {
        "code": "3343",
        "name": "Phường Tân An",
        "type": "phuong"
      },
      {
        "code": "2831",
        "name": "Phường Tân Lộc",
        "type": "phuong"
      },
      {
        "code": "16143",
        "name": "Phường Thốt Nốt",
        "type": "phuong"
      },
      {
        "code": "3599",
        "name": "Phường Thới An Đông",
        "type": "phuong"
      },
      {
        "code": "4623",
        "name": "Phường Thới Long",
        "type": "phuong"
      },
      {
        "code": "16399",
        "name": "Phường Thuận Hưng",
        "type": "phuong"
      },
      {
        "code": "5135",
        "name": "Phường Trung Nhứt",
        "type": "phuong"
      },
      {
        "code": "8975",
        "name": "Phường Vị Tân",
        "type": "phuong"
      },
      {
        "code": "8719",
        "name": "Phường Vị Thanh",
        "type": "phuong"
      },
      {
        "code": "18703",
        "name": "Phường Vĩnh Châu",
        "type": "phuong"
      },
      {
        "code": "18447",
        "name": "Phường Vĩnh Phước",
        "type": "phuong"
      },
      {
        "code": "25615",
        "name": "Xã An Lạc Thôn",
        "type": "xa"
      },
      {
        "code": "16911",
        "name": "Xã An Ninh",
        "type": "xa"
      },
      {
        "code": "22031",
        "name": "Xã An Thạnh",
        "type": "xa"
      },
      {
        "code": "12815",
        "name": "Xã Châu Thành",
        "type": "xa"
      },
      {
        "code": "6927",
        "name": "Xã Cờ Đỏ",
        "type": "xa"
      },
      {
        "code": "22287",
        "name": "Xã Cù Lao Dung",
        "type": "xa"
      },
      {
        "code": "26383",
        "name": "Xã Đại Hải",
        "type": "xa"
      },
      {
        "code": "22543",
        "name": "Xã Đại Ngãi",
        "type": "xa"
      },
      {
        "code": "7183",
        "name": "Xã Đông Hiệp",
        "type": "xa"
      },
      {
        "code": "13071",
        "name": "Xã Đông Phước",
        "type": "xa"
      },
      {
        "code": "6159",
        "name": "Xã Đông Thuận",
        "type": "xa"
      },
      {
        "code": "24591",
        "name": "Xã Gia Hòa",
        "type": "xa"
      },
      {
        "code": "15119",
        "name": "Xã Hiệp Hưng",
        "type": "xa"
      },
      {
        "code": "14351",
        "name": "Xã Hòa An",
        "type": "xa"
      },
      {
        "code": "9231",
        "name": "Xã Hỏa Lựu",
        "type": "xa"
      },
      {
        "code": "24335",
        "name": "Xã Hòa Tú",
        "type": "xa"
      },
      {
        "code": "17423",
        "name": "Xã Hồ Đắc Kiện",
        "type": "xa"
      },
      {
        "code": "25871",
        "name": "Xã Kế Sách",
        "type": "xa"
      },
      {
        "code": "527",
        "name": "Xã Lai Hòa",
        "type": "xa"
      },
      {
        "code": "20495",
        "name": "Xã Lâm Tân",
        "type": "xa"
      },
      {
        "code": "21519",
        "name": "Xã Lịch Hội Thượng",
        "type": "xa"
      },
      {
        "code": "21263",
        "name": "Xã Liêu Tú",
        "type": "xa"
      },
      {
        "code": "17935",
        "name": "Xã Long Hưng",
        "type": "xa"
      },
      {
        "code": "23055",
        "name": "Xã Long Phú",
        "type": "xa"
      },
      {
        "code": "11023",
        "name": "Xã Lương Tâm",
        "type": "xa"
      },
      {
        "code": "18191",
        "name": "Xã Mỹ Hương",
        "type": "xa"
      },
      {
        "code": "1039",
        "name": "Xã Mỹ Phước",
        "type": "xa"
      },
      {
        "code": "17679",
        "name": "Xã Mỹ Tú",
        "type": "xa"
      },
      {
        "code": "25103",
        "name": "Xã Ngọc Tố",
        "type": "xa"
      },
      {
        "code": "5647",
        "name": "Xã Nhơn Ái",
        "type": "xa"
      },
      {
        "code": "23311",
        "name": "Xã Nhơn Mỹ",
        "type": "xa"
      },
      {
        "code": "24847",
        "name": "Xã Nhu Gia",
        "type": "xa"
      },
      {
        "code": "5391",
        "name": "Xã Phong Điền",
        "type": "xa"
      },
      {
        "code": "271",
        "name": "Xã Phong Nẫm",
        "type": "xa"
      },
      {
        "code": "13327",
        "name": "Xã Phú Hữu",
        "type": "xa"
      },
      {
        "code": "19983",
        "name": "Xã Phú Lộc",
        "type": "xa"
      },
      {
        "code": "16655",
        "name": "Xã Phú Tâm",
        "type": "xa"
      },
      {
        "code": "15375",
        "name": "Xã Phụng Hiệp",
        "type": "xa"
      },
      {
        "code": "14607",
        "name": "Xã Phương Bình",
        "type": "xa"
      },
      {
        "code": "21007",
        "name": "Xã Tài Văn",
        "type": "xa"
      },
      {
        "code": "14095",
        "name": "Xã Tân Bình",
        "type": "xa"
      },
      {
        "code": "12303",
        "name": "Xã Tân Hòa",
        "type": "xa"
      },
      {
        "code": "19727",
        "name": "Xã Tân Long",
        "type": "xa"
      },
      {
        "code": "14863",
        "name": "Xã Tân Phước Hưng",
        "type": "xa"
      },
      {
        "code": "22799",
        "name": "Xã Tân Thạnh",
        "type": "xa"
      },
      {
        "code": "8207",
        "name": "Xã Thạnh An",
        "type": "xa"
      },
      {
        "code": "15631",
        "name": "Xã Thạnh Hòa",
        "type": "xa"
      },
      {
        "code": "1295",
        "name": "Xã Thạnh Phú",
        "type": "xa"
      },
      {
        "code": "8463",
        "name": "Xã Thạnh Quới",
        "type": "xa"
      },
      {
        "code": "20751",
        "name": "Xã Thạnh Thới An",
        "type": "xa"
      },
      {
        "code": "12047",
        "name": "Xã Thạnh Xuân",
        "type": "xa"
      },
      {
        "code": "26127",
        "name": "Xã Thới An Hội",
        "type": "xa"
      },
      {
        "code": "1551",
        "name": "Xã Thới Hưng",
        "type": "xa"
      },
      {
        "code": "5903",
        "name": "Xã Thới Lai",
        "type": "xa"
      },
      {
        "code": "17167",
        "name": "Xã Thuận Hòa",
        "type": "xa"
      },
      {
        "code": "21775",
        "name": "Xã Trần Đề",
        "type": "xa"
      },
      {
        "code": "7439",
        "name": "Xã Trung Hưng",
        "type": "xa"
      },
      {
        "code": "25359",
        "name": "Xã Trường Khánh",
        "type": "xa"
      },
      {
        "code": "1807",
        "name": "Xã Trường Long",
        "type": "xa"
      },
      {
        "code": "12559",
        "name": "Xã Trường Long Tây",
        "type": "xa"
      },
      {
        "code": "6671",
        "name": "Xã Trường Thành",
        "type": "xa"
      },
      {
        "code": "6415",
        "name": "Xã Trường Xuân",
        "type": "xa"
      },
      {
        "code": "9999",
        "name": "Xã Vị Thanh 1",
        "type": "xa"
      },
      {
        "code": "9487",
        "name": "Xã Vị Thủy",
        "type": "xa"
      },
      {
        "code": "783",
        "name": "Xã Vĩnh Hải",
        "type": "xa"
      },
      {
        "code": "20239",
        "name": "Xã Vĩnh Lợi",
        "type": "xa"
      },
      {
        "code": "7695",
        "name": "Xã Vĩnh Thạnh",
        "type": "xa"
      },
      {
        "code": "9743",
        "name": "Xã Vĩnh Thuận Đông",
        "type": "xa"
      },
      {
        "code": "7951",
        "name": "Xã Vĩnh Trinh",
        "type": "xa"
      },
      {
        "code": "10255",
        "name": "Xã Vĩnh Tường",
        "type": "xa"
      },
      {
        "code": "10511",
        "name": "Xã Vĩnh Viễn",
        "type": "xa"
      },
      {
        "code": "10767",
        "name": "Xã Xà Phiên",
        "type": "xa"
      }
    ]
  },
  {
    "code": "13",
    "name": "TP. Đà Nẵng",
    "wards": [
      {
        "code": "1549",
        "name": "Đặc Khu Hoàng Sa",
        "type": "dac-khu"
      },
      {
        "code": "20493",
        "name": "Phường An Hải",
        "type": "phuong"
      },
      {
        "code": "20237",
        "name": "Phường An Khê",
        "type": "phuong"
      },
      {
        "code": "11277",
        "name": "Phường An Thắng",
        "type": "phuong"
      },
      {
        "code": "2317",
        "name": "Phường Bàn Thạch",
        "type": "phuong"
      },
      {
        "code": "21773",
        "name": "Phường Cẩm Lệ",
        "type": "phuong"
      },
      {
        "code": "10765",
        "name": "Phường Điện Bàn",
        "type": "phuong"
      },
      {
        "code": "11533",
        "name": "Phường Điện Bàn Bắc",
        "type": "phuong"
      },
      {
        "code": "11021",
        "name": "Phường Điện Bàn Đông",
        "type": "phuong"
      },
      {
        "code": "19469",
        "name": "Phường Hải Châu",
        "type": "phuong"
      },
      {
        "code": "781",
        "name": "Phường Hải Vân",
        "type": "phuong"
      },
      {
        "code": "19725",
        "name": "Phường Hòa Cường",
        "type": "phuong"
      },
      {
        "code": "21261",
        "name": "Phường Hòa Khánh",
        "type": "phuong"
      },
      {
        "code": "22029",
        "name": "Phường Hòa Xuân",
        "type": "phuong"
      },
      {
        "code": "12301",
        "name": "Phường Hội An",
        "type": "phuong"
      },
      {
        "code": "12557",
        "name": "Phường Hội An Đông",
        "type": "phuong"
      },
      {
        "code": "12813",
        "name": "Phường Hội An Tây",
        "type": "phuong"
      },
      {
        "code": "2061",
        "name": "Phường Hương Trà",
        "type": "phuong"
      },
      {
        "code": "21517",
        "name": "Phường Liên Chiểu",
        "type": "phuong"
      },
      {
        "code": "21005",
        "name": "Phường Ngũ Hành Sơn",
        "type": "phuong"
      },
      {
        "code": "1805",
        "name": "Phường Quảng Phú",
        "type": "phuong"
      },
      {
        "code": "20749",
        "name": "Phường Sơn Trà",
        "type": "phuong"
      },
      {
        "code": "24077",
        "name": "Phường Tam Kỳ",
        "type": "phuong"
      },
      {
        "code": "19981",
        "name": "Phường Thanh Khê",
        "type": "phuong"
      },
      {
        "code": "16653",
        "name": "Xã Avương",
        "type": "xa"
      },
      {
        "code": "22797",
        "name": "Xã Bà Nà",
        "type": "xa"
      },
      {
        "code": "14349",
        "name": "Xã Bến Giằng",
        "type": "xa"
      },
      {
        "code": "16397",
        "name": "Xã Bến Hiên",
        "type": "xa"
      },
      {
        "code": "2829",
        "name": "Xã Chiên Đàn",
        "type": "xa"
      },
      {
        "code": "9741",
        "name": "Xã Duy Nghĩa",
        "type": "xa"
      },
      {
        "code": "10253",
        "name": "Xã Duy Xuyên",
        "type": "xa"
      },
      {
        "code": "13069",
        "name": "Xã Đại Lộc",
        "type": "xa"
      },
      {
        "code": "14861",
        "name": "Xã Đắc Pring",
        "type": "xa"
      },
      {
        "code": "11789",
        "name": "Xã Điện Bàn Tây",
        "type": "xa"
      },
      {
        "code": "8205",
        "name": "Xã Đồng Dương",
        "type": "xa"
      },
      {
        "code": "16141",
        "name": "Xã Đông Giang",
        "type": "xa"
      },
      {
        "code": "23565",
        "name": "Xã Đức Phú",
        "type": "xa"
      },
      {
        "code": "12045",
        "name": "Xã Gò Nổi",
        "type": "xa"
      },
      {
        "code": "13325",
        "name": "Xã Hà Nha",
        "type": "xa"
      },
      {
        "code": "17421",
        "name": "Xã Hiệp Đức",
        "type": "xa"
      },
      {
        "code": "22541",
        "name": "Xã Hòa Tiến",
        "type": "xa"
      },
      {
        "code": "22285",
        "name": "Xã Hòa Vang",
        "type": "xa"
      },
      {
        "code": "17165",
        "name": "Xã Hùng Sơn",
        "type": "xa"
      },
      {
        "code": "18189",
        "name": "Xã Khâm Đức",
        "type": "xa"
      },
      {
        "code": "15117",
        "name": "Xã La Dêê",
        "type": "xa"
      },
      {
        "code": "15373",
        "name": "Xã La Êê",
        "type": "xa"
      },
      {
        "code": "3341",
        "name": "Xã Lãnh Ngọc",
        "type": "xa"
      },
      {
        "code": "14605",
        "name": "Xã Nam Giang",
        "type": "xa"
      },
      {
        "code": "9997",
        "name": "Xã Nam Phước",
        "type": "xa"
      },
      {
        "code": "5645",
        "name": "Xã Nam Trà My",
        "type": "xa"
      },
      {
        "code": "9229",
        "name": "Xã Nông Sơn",
        "type": "xa"
      },
      {
        "code": "525",
        "name": "Xã Núi Thành",
        "type": "xa"
      },
      {
        "code": "3085",
        "name": "Xã Phú Ninh",
        "type": "xa"
      },
      {
        "code": "14093",
        "name": "Xã Phú Thuận",
        "type": "xa"
      },
      {
        "code": "18701",
        "name": "Xã Phước Chánh",
        "type": "xa"
      },
      {
        "code": "19213",
        "name": "Xã Phước Hiệp",
        "type": "xa"
      },
      {
        "code": "18445",
        "name": "Xã Phước Năng",
        "type": "xa"
      },
      {
        "code": "18957",
        "name": "Xã Phước Thành",
        "type": "xa"
      },
      {
        "code": "17933",
        "name": "Xã Phước Trà",
        "type": "xa"
      },
      {
        "code": "9485",
        "name": "Xã Quế Phước",
        "type": "xa"
      },
      {
        "code": "8717",
        "name": "Xã Quế Sơn",
        "type": "xa"
      },
      {
        "code": "8461",
        "name": "Xã Quế Sơn Trung",
        "type": "xa"
      },
      {
        "code": "15885",
        "name": "Xã Sông Kôn",
        "type": "xa"
      },
      {
        "code": "15629",
        "name": "Xã Sông Vàng",
        "type": "xa"
      },
      {
        "code": "4109",
        "name": "Xã Sơn Cẩm Hà",
        "type": "xa"
      },
      {
        "code": "23309",
        "name": "Xã Tam Anh",
        "type": "xa"
      },
      {
        "code": "269",
        "name": "Xã Tam Hải",
        "type": "xa"
      },
      {
        "code": "23053",
        "name": "Xã Tam Mỹ",
        "type": "xa"
      },
      {
        "code": "23821",
        "name": "Xã Tam Xuân",
        "type": "xa"
      },
      {
        "code": "1293",
        "name": "Xã Tân Hiệp",
        "type": "xa"
      },
      {
        "code": "16909",
        "name": "Xã Tây Giang",
        "type": "xa"
      },
      {
        "code": "2573",
        "name": "Xã Tây Hồ",
        "type": "xa"
      },
      {
        "code": "3853",
        "name": "Xã Thạnh Bình",
        "type": "xa"
      },
      {
        "code": "1037",
        "name": "Xã Thạnh Mỹ",
        "type": "xa"
      },
      {
        "code": "7181",
        "name": "Xã Thăng An",
        "type": "xa"
      },
      {
        "code": "6925",
        "name": "Xã Thăng Bình",
        "type": "xa"
      },
      {
        "code": "7693",
        "name": "Xã Thăng Điền",
        "type": "xa"
      },
      {
        "code": "7949",
        "name": "Xã Thăng Phú",
        "type": "xa"
      },
      {
        "code": "7437",
        "name": "Xã Thăng Trường",
        "type": "xa"
      },
      {
        "code": "10509",
        "name": "Xã Thu Bồn",
        "type": "xa"
      },
      {
        "code": "13581",
        "name": "Xã Thượng Đức",
        "type": "xa"
      },
      {
        "code": "3597",
        "name": "Xã Tiên Phước",
        "type": "xa"
      },
      {
        "code": "5133",
        "name": "Xã Trà Đốc",
        "type": "xa"
      },
      {
        "code": "4621",
        "name": "Xã Trà Giáp",
        "type": "xa"
      },
      {
        "code": "6669",
        "name": "Xã Trà Leng",
        "type": "xa"
      },
      {
        "code": "4365",
        "name": "Xã Trà Liên",
        "type": "xa"
      },
      {
        "code": "6413",
        "name": "Xã Trà Linh",
        "type": "xa"
      },
      {
        "code": "5389",
        "name": "Xã Trà My",
        "type": "xa"
      },
      {
        "code": "4877",
        "name": "Xã Trà Tân",
        "type": "xa"
      },
      {
        "code": "5901",
        "name": "Xã Trà Tập",
        "type": "xa"
      },
      {
        "code": "6157",
        "name": "Xã Trà Vân",
        "type": "xa"
      },
      {
        "code": "17677",
        "name": "Xã Việt An",
        "type": "xa"
      },
      {
        "code": "13837",
        "name": "Xã Vu Gia",
        "type": "xa"
      },
      {
        "code": "8973",
        "name": "Xã Xuân Phú",
        "type": "xa"
      }
    ]
  },
  {
    "code": "11",
    "name": "TP. Hà Nội",
    "wards": [
      {
        "code": "14091",
        "name": "Phường Ba Đình",
        "type": "phuong"
      },
      {
        "code": "27915",
        "name": "Phường Bạch Mai",
        "type": "phuong"
      },
      {
        "code": "18443",
        "name": "Phường Bồ Đề",
        "type": "phuong"
      },
      {
        "code": "14859",
        "name": "Phường Cầu Giấy",
        "type": "phuong"
      },
      {
        "code": "11531",
        "name": "Phường Chương Mỹ",
        "type": "phuong"
      },
      {
        "code": "17419",
        "name": "Phường Cửa Nam",
        "type": "phuong"
      },
      {
        "code": "21259",
        "name": "Phường Dương Nội",
        "type": "phuong"
      },
      {
        "code": "23563",
        "name": "Phường Đại Mỗ",
        "type": "phuong"
      },
      {
        "code": "10507",
        "name": "Phường Định Công",
        "type": "phuong"
      },
      {
        "code": "25099",
        "name": "Phường Đống Đa",
        "type": "phuong"
      },
      {
        "code": "26379",
        "name": "Phường Đông Ngạc",
        "type": "phuong"
      },
      {
        "code": "14347",
        "name": "Phường Giảng Võ",
        "type": "phuong"
      },
      {
        "code": "21771",
        "name": "Phường Hà Đông",
        "type": "phuong"
      },
      {
        "code": "22027",
        "name": "Phường Hai Bà Trưng",
        "type": "phuong"
      },
      {
        "code": "31755",
        "name": "Phường Hoàn Kiếm",
        "type": "phuong"
      },
      {
        "code": "4363",
        "name": "Phường Hoàng Liệt",
        "type": "phuong"
      },
      {
        "code": "25867",
        "name": "Phường Hoàng Mai",
        "type": "phuong"
      },
      {
        "code": "17163",
        "name": "Phường Hồng Hà",
        "type": "phuong"
      },
      {
        "code": "20747",
        "name": "Phường Khương Đình",
        "type": "phuong"
      },
      {
        "code": "21515",
        "name": "Phường Kiến Hưng",
        "type": "phuong"
      },
      {
        "code": "24587",
        "name": "Phường Kim Liên",
        "type": "phuong"
      },
      {
        "code": "24843",
        "name": "Phường Láng",
        "type": "phuong"
      },
      {
        "code": "4619",
        "name": "Phường Lĩnh Nam",
        "type": "phuong"
      },
      {
        "code": "20491",
        "name": "Phường Long Biên",
        "type": "phuong"
      },
      {
        "code": "15115",
        "name": "Phường Nghĩa Đô",
        "type": "phuong"
      },
      {
        "code": "14603",
        "name": "Phường Ngọc Hà",
        "type": "phuong"
      },
      {
        "code": "24331",
        "name": "Phường Ô Chợ Dừa",
        "type": "phuong"
      },
      {
        "code": "1035",
        "name": "Phường Phú Diễn",
        "type": "phuong"
      },
      {
        "code": "21003",
        "name": "Phường Phú Lương",
        "type": "phuong"
      },
      {
        "code": "25611",
        "name": "Phường Phú Thượng",
        "type": "phuong"
      },
      {
        "code": "12555",
        "name": "Phường Phúc Lợi",
        "type": "phuong"
      },
      {
        "code": "2571",
        "name": "Phường Phương Liệt",
        "type": "phuong"
      },
      {
        "code": "28427",
        "name": "Phường Sơn Tây",
        "type": "phuong"
      },
      {
        "code": "32267",
        "name": "Phường Tây Hồ",
        "type": "phuong"
      },
      {
        "code": "779",
        "name": "Phường Tây Mỗ",
        "type": "phuong"
      },
      {
        "code": "1291",
        "name": "Phường Tây Tựu",
        "type": "phuong"
      },
      {
        "code": "5131",
        "name": "Phường Thanh Liệt",
        "type": "phuong"
      },
      {
        "code": "28171",
        "name": "Phường Thanh Xuân",
        "type": "phuong"
      },
      {
        "code": "1547",
        "name": "Phường Thượng Cát",
        "type": "phuong"
      },
      {
        "code": "2827",
        "name": "Phường Tùng Thiện",
        "type": "phuong"
      },
      {
        "code": "26123",
        "name": "Phường Từ Liêm",
        "type": "phuong"
      },
      {
        "code": "4875",
        "name": "Phường Tương Mai",
        "type": "phuong"
      },
      {
        "code": "25355",
        "name": "Phường Văn Miếu-Quốc Tử Giám",
        "type": "phuong"
      },
      {
        "code": "12811",
        "name": "Phường Việt Hưng",
        "type": "phuong"
      },
      {
        "code": "18187",
        "name": "Phường Vĩnh Hưng",
        "type": "phuong"
      },
      {
        "code": "16907",
        "name": "Phường Vĩnh Tuy",
        "type": "phuong"
      },
      {
        "code": "1803",
        "name": "Phường Xuân Đỉnh",
        "type": "phuong"
      },
      {
        "code": "2059",
        "name": "Phường Xuân Phương",
        "type": "phuong"
      },
      {
        "code": "24075",
        "name": "Phường Yên Hòa",
        "type": "phuong"
      },
      {
        "code": "17675",
        "name": "Phường Yên Nghĩa",
        "type": "phuong"
      },
      {
        "code": "32011",
        "name": "Phường Yên Sở",
        "type": "phuong"
      },
      {
        "code": "15883",
        "name": "Xã An Khánh",
        "type": "xa"
      },
      {
        "code": "3851",
        "name": "Xã Ba Vì",
        "type": "xa"
      },
      {
        "code": "27403",
        "name": "Xã Bát Tràng",
        "type": "xa"
      },
      {
        "code": "10763",
        "name": "Xã Bất Bạt",
        "type": "xa"
      },
      {
        "code": "13579",
        "name": "Xã Bình Minh",
        "type": "xa"
      },
      {
        "code": "16651",
        "name": "Xã Chuyên Mỹ",
        "type": "xa"
      },
      {
        "code": "28939",
        "name": "Xã Chương Dương",
        "type": "xa"
      },
      {
        "code": "4107",
        "name": "Xã Cổ Đô",
        "type": "xa"
      },
      {
        "code": "13835",
        "name": "Xã Dân Hòa",
        "type": "xa"
      },
      {
        "code": "7947",
        "name": "Xã Dương Hòa",
        "type": "xa"
      },
      {
        "code": "31243",
        "name": "Xã Đa Phúc",
        "type": "xa"
      },
      {
        "code": "5387",
        "name": "Xã Đại Thanh",
        "type": "xa"
      },
      {
        "code": "2315",
        "name": "Xã Đại Xuyên",
        "type": "xa"
      },
      {
        "code": "28683",
        "name": "Xã Đan Phượng",
        "type": "xa"
      },
      {
        "code": "3083",
        "name": "Xã Đoài Phương",
        "type": "xa"
      },
      {
        "code": "7179",
        "name": "Xã Đông Anh",
        "type": "xa"
      },
      {
        "code": "3339",
        "name": "Xã Gia Lâm",
        "type": "xa"
      },
      {
        "code": "22795",
        "name": "Xã Hạ Bằng",
        "type": "xa"
      },
      {
        "code": "30731",
        "name": "Xã Hát Môn",
        "type": "xa"
      },
      {
        "code": "13067",
        "name": "Xã Hòa Lạc",
        "type": "xa"
      },
      {
        "code": "26635",
        "name": "Xã Hòa Phú",
        "type": "xa"
      },
      {
        "code": "27147",
        "name": "Xã Hòa Xá",
        "type": "xa"
      },
      {
        "code": "15627",
        "name": "Xã Hoài Đức",
        "type": "xa"
      },
      {
        "code": "29707",
        "name": "Xã Hồng Sơn",
        "type": "xa"
      },
      {
        "code": "17931",
        "name": "Xã Hồng Vân",
        "type": "xa"
      },
      {
        "code": "29963",
        "name": "Xã Hưng Đạo",
        "type": "xa"
      },
      {
        "code": "9227",
        "name": "Xã Hương Sơn",
        "type": "xa"
      },
      {
        "code": "18699",
        "name": "Xã Kiều Phú",
        "type": "xa"
      },
      {
        "code": "19467",
        "name": "Xã Kim Anh",
        "type": "xa"
      },
      {
        "code": "6667",
        "name": "Xã Liên Minh",
        "type": "xa"
      },
      {
        "code": "9483",
        "name": "Xã Mê Linh",
        "type": "xa"
      },
      {
        "code": "267",
        "name": "Xã Minh Châu",
        "type": "xa"
      },
      {
        "code": "10251",
        "name": "Xã Mỹ Đức",
        "type": "xa"
      },
      {
        "code": "23051",
        "name": "Xã Nam Phù",
        "type": "xa"
      },
      {
        "code": "523",
        "name": "Xã Ngọc Hồi",
        "type": "xa"
      },
      {
        "code": "19723",
        "name": "Xã Nội Bài",
        "type": "xa"
      },
      {
        "code": "5899",
        "name": "Xã Ô Diên",
        "type": "xa"
      },
      {
        "code": "18955",
        "name": "Xã Phú Cát",
        "type": "xa"
      },
      {
        "code": "15371",
        "name": "Xã Phù Đổng",
        "type": "xa"
      },
      {
        "code": "12043",
        "name": "Xã Phú Nghĩa",
        "type": "xa"
      },
      {
        "code": "7435",
        "name": "Xã Phú Xuyên",
        "type": "xa"
      },
      {
        "code": "31499",
        "name": "Xã Phúc Lộc",
        "type": "xa"
      },
      {
        "code": "16139",
        "name": "Xã Phúc Sơn",
        "type": "xa"
      },
      {
        "code": "8203",
        "name": "Xã Phúc Thịnh",
        "type": "xa"
      },
      {
        "code": "30987",
        "name": "Xã Phúc Thọ",
        "type": "xa"
      },
      {
        "code": "29195",
        "name": "Xã Phượng Dực",
        "type": "xa"
      },
      {
        "code": "6155",
        "name": "Xã Quảng Bị",
        "type": "xa"
      },
      {
        "code": "8971",
        "name": "Xã Quang Minh",
        "type": "xa"
      },
      {
        "code": "7691",
        "name": "Xã Quảng Oai",
        "type": "xa"
      },
      {
        "code": "20235",
        "name": "Xã Quốc Oai",
        "type": "xa"
      },
      {
        "code": "19211",
        "name": "Xã Sóc Sơn",
        "type": "xa"
      },
      {
        "code": "16395",
        "name": "Xã Sơn Đồng",
        "type": "xa"
      },
      {
        "code": "3595",
        "name": "Xã Suối Hai",
        "type": "xa"
      },
      {
        "code": "30219",
        "name": "Xã Tam Hưng",
        "type": "xa"
      },
      {
        "code": "26891",
        "name": "Xã Tây Phương",
        "type": "xa"
      },
      {
        "code": "22539",
        "name": "Xã Thạch Thất",
        "type": "xa"
      },
      {
        "code": "13323",
        "name": "Xã Thanh Oai",
        "type": "xa"
      },
      {
        "code": "23307",
        "name": "Xã Thanh Trì",
        "type": "xa"
      },
      {
        "code": "8715",
        "name": "Xã Thiên Lộc",
        "type": "xa"
      },
      {
        "code": "27659",
        "name": "Xã Thuận An",
        "type": "xa"
      },
      {
        "code": "6923",
        "name": "Xã Thư Lâm",
        "type": "xa"
      },
      {
        "code": "22283",
        "name": "Xã Thượng Phúc",
        "type": "xa"
      },
      {
        "code": "5643",
        "name": "Xã Thường Tín",
        "type": "xa"
      },
      {
        "code": "9739",
        "name": "Xã Tiến Thắng",
        "type": "xa"
      },
      {
        "code": "6411",
        "name": "Xã Trần Phú",
        "type": "xa"
      },
      {
        "code": "19979",
        "name": "Xã Trung Giã",
        "type": "xa"
      },
      {
        "code": "30475",
        "name": "Xã Ứng Hòa",
        "type": "xa"
      },
      {
        "code": "29451",
        "name": "Xã Ứng Thiên",
        "type": "xa"
      },
      {
        "code": "23819",
        "name": "Xã Vân Đình",
        "type": "xa"
      },
      {
        "code": "11019",
        "name": "Xã Vật Lại",
        "type": "xa"
      },
      {
        "code": "8459",
        "name": "Xã Vĩnh Thanh",
        "type": "xa"
      },
      {
        "code": "11787",
        "name": "Xã Xuân Mai",
        "type": "xa"
      },
      {
        "code": "11275",
        "name": "Xã Yên Bài",
        "type": "xa"
      },
      {
        "code": "9995",
        "name": "Xã Yên Lãng",
        "type": "xa"
      },
      {
        "code": "12299",
        "name": "Xã Yên Xuân",
        "type": "xa"
      }
    ]
  },
  {
    "code": "14",
    "name": "TP. Hải Phòng",
    "wards": [
      {
        "code": "9486",
        "name": "Đặc Khu Bạch Long Vĩ",
        "type": "dac-khu"
      },
      {
        "code": "25614",
        "name": "Đặc Khu Cát Hải",
        "type": "dac-khu"
      },
      {
        "code": "1294",
        "name": "Phường Ái Quốc",
        "type": "phuong"
      },
      {
        "code": "5134",
        "name": "Phường An Biên",
        "type": "phuong"
      },
      {
        "code": "27662",
        "name": "Phường An Dương",
        "type": "phuong"
      },
      {
        "code": "9742",
        "name": "Phường An Hải",
        "type": "phuong"
      },
      {
        "code": "11278",
        "name": "Phường An Phong",
        "type": "phuong"
      },
      {
        "code": "17678",
        "name": "Phường Bạch Đằng",
        "type": "phuong"
      },
      {
        "code": "7438",
        "name": "Phường Bắc An Phụ",
        "type": "phuong"
      },
      {
        "code": "18702",
        "name": "Phường Chí Linh",
        "type": "phuong"
      },
      {
        "code": "28174",
        "name": "Phường Chu Văn An",
        "type": "phuong"
      },
      {
        "code": "2574",
        "name": "Phường Dương Kinh",
        "type": "phuong"
      },
      {
        "code": "27150",
        "name": "Phường Đồ Sơn",
        "type": "phuong"
      },
      {
        "code": "2830",
        "name": "Phường Đông Hải",
        "type": "phuong"
      },
      {
        "code": "10254",
        "name": "Phường Gia Viên",
        "type": "phuong"
      },
      {
        "code": "2062",
        "name": "Phường Hải An",
        "type": "phuong"
      },
      {
        "code": "17934",
        "name": "Phường Hải Dương",
        "type": "phuong"
      },
      {
        "code": "12302",
        "name": "Phường Hòa Bình",
        "type": "phuong"
      },
      {
        "code": "11022",
        "name": "Phường Hồng An",
        "type": "phuong"
      },
      {
        "code": "26382",
        "name": "Phường Hồng Bàng",
        "type": "phuong"
      },
      {
        "code": "27406",
        "name": "Phường Hưng Đạo",
        "type": "phuong"
      },
      {
        "code": "4622",
        "name": "Phường Kiến An",
        "type": "phuong"
      },
      {
        "code": "19470",
        "name": "Phường Kinh Môn",
        "type": "phuong"
      },
      {
        "code": "26894",
        "name": "Phường Lê Chân",
        "type": "phuong"
      },
      {
        "code": "19214",
        "name": "Phường Lê Đại Hành",
        "type": "phuong"
      },
      {
        "code": "13070",
        "name": "Phường Lê Ích Mộc",
        "type": "phuong"
      },
      {
        "code": "6158",
        "name": "Phường Lê Thanh Nghị",
        "type": "phuong"
      },
      {
        "code": "12046",
        "name": "Phường Lưu Kiếm",
        "type": "phuong"
      },
      {
        "code": "2318",
        "name": "Phường Nam Đồ Sơn",
        "type": "phuong"
      },
      {
        "code": "18446",
        "name": "Phường Nam Đồng",
        "type": "phuong"
      },
      {
        "code": "12558",
        "name": "Phường Nam Triệu",
        "type": "phuong"
      },
      {
        "code": "26638",
        "name": "Phường Ngô Quyền",
        "type": "phuong"
      },
      {
        "code": "19726",
        "name": "Phường Nguyễn Đại Năng",
        "type": "phuong"
      },
      {
        "code": "18958",
        "name": "Phường Nguyễn Trãi",
        "type": "phuong"
      },
      {
        "code": "20238",
        "name": "Phường Nhị Chiểu",
        "type": "phuong"
      },
      {
        "code": "19982",
        "name": "Phường Phạm Sư Mạnh",
        "type": "phuong"
      },
      {
        "code": "4878",
        "name": "Phường Phù Liễn",
        "type": "phuong"
      },
      {
        "code": "1038",
        "name": "Phường Tân Hưng",
        "type": "phuong"
      },
      {
        "code": "6414",
        "name": "Phường Thạch Khôi",
        "type": "phuong"
      },
      {
        "code": "18190",
        "name": "Phường Thành Đông",
        "type": "phuong"
      },
      {
        "code": "11790",
        "name": "Phường Thiên Hương",
        "type": "phuong"
      },
      {
        "code": "26126",
        "name": "Phường Thủy Nguyên",
        "type": "phuong"
      },
      {
        "code": "8974",
        "name": "Phường Trần Hưng Đạo",
        "type": "phuong"
      },
      {
        "code": "5902",
        "name": "Phường Trần Liễu",
        "type": "phuong"
      },
      {
        "code": "8718",
        "name": "Phường Trần Nhân Tông",
        "type": "phuong"
      },
      {
        "code": "27918",
        "name": "Phường Tứ Minh",
        "type": "phuong"
      },
      {
        "code": "526",
        "name": "Phường Việt Hòa",
        "type": "phuong"
      },
      {
        "code": "14094",
        "name": "Xã An Hưng",
        "type": "xa"
      },
      {
        "code": "1550",
        "name": "Xã An Khánh",
        "type": "xa"
      },
      {
        "code": "4110",
        "name": "Xã An Lão",
        "type": "xa"
      },
      {
        "code": "13326",
        "name": "Xã An Phú",
        "type": "xa"
      },
      {
        "code": "14350",
        "name": "Xã An Quang",
        "type": "xa"
      },
      {
        "code": "25358",
        "name": "Xã An Thành",
        "type": "xa"
      },
      {
        "code": "14606",
        "name": "Xã An Trường",
        "type": "xa"
      },
      {
        "code": "24590",
        "name": "Xã Bắc Thanh Miện",
        "type": "xa"
      },
      {
        "code": "3598",
        "name": "Xã Bình Giang",
        "type": "xa"
      },
      {
        "code": "22030",
        "name": "Xã Cẩm Giang",
        "type": "xa"
      },
      {
        "code": "782",
        "name": "Xã Cẩm Giàng",
        "type": "xa"
      },
      {
        "code": "15630",
        "name": "Xã Chấn Hưng",
        "type": "xa"
      },
      {
        "code": "22798",
        "name": "Xã Chí Minh",
        "type": "xa"
      },
      {
        "code": "9230",
        "name": "Xã Đại Sơn",
        "type": "xa"
      },
      {
        "code": "3086",
        "name": "Xã Đường An",
        "type": "xa"
      },
      {
        "code": "28686",
        "name": "Xã Gia Lộc",
        "type": "xa"
      },
      {
        "code": "3854",
        "name": "Xã Gia Phúc",
        "type": "xa"
      },
      {
        "code": "13582",
        "name": "Xã Hà Bắc",
        "type": "xa"
      },
      {
        "code": "21774",
        "name": "Xã Hà Đông",
        "type": "xa"
      },
      {
        "code": "7694",
        "name": "Xã Hà Nam",
        "type": "xa"
      },
      {
        "code": "7950",
        "name": "Xã Hà Tây",
        "type": "xa"
      },
      {
        "code": "24846",
        "name": "Xã Hải Hưng",
        "type": "xa"
      },
      {
        "code": "24078",
        "name": "Xã Hồng Châu",
        "type": "xa"
      },
      {
        "code": "21262",
        "name": "Xã Hợp Tiến",
        "type": "xa"
      },
      {
        "code": "15886",
        "name": "Xã Hùng Thắng",
        "type": "xa"
      },
      {
        "code": "28430",
        "name": "Xã Kẻ Sặt",
        "type": "xa"
      },
      {
        "code": "23566",
        "name": "Xã Khúc Thừa Dụ",
        "type": "xa"
      },
      {
        "code": "4366",
        "name": "Xã Kiến Hải",
        "type": "xa"
      },
      {
        "code": "9998",
        "name": "Xã Kiến Hưng",
        "type": "xa"
      },
      {
        "code": "14862",
        "name": "Xã Kiến Minh",
        "type": "xa"
      },
      {
        "code": "25870",
        "name": "Xã Kiến Thụy",
        "type": "xa"
      },
      {
        "code": "11534",
        "name": "Xã Kim Thành",
        "type": "xa"
      },
      {
        "code": "8462",
        "name": "Xã Lạc Phượng",
        "type": "xa"
      },
      {
        "code": "13838",
        "name": "Xã Lai Khê",
        "type": "xa"
      },
      {
        "code": "270",
        "name": "Xã Mao Điền",
        "type": "xa"
      },
      {
        "code": "7182",
        "name": "Xã Nam An Phụ",
        "type": "xa"
      },
      {
        "code": "20494",
        "name": "Xã Nam Sách",
        "type": "xa"
      },
      {
        "code": "25102",
        "name": "Xã Nam Thanh Miện",
        "type": "xa"
      },
      {
        "code": "15118",
        "name": "Xã Nghi Dương",
        "type": "xa"
      },
      {
        "code": "16398",
        "name": "Xã Nguyễn Bỉnh Khiêm",
        "type": "xa"
      },
      {
        "code": "6926",
        "name": "Xã Nguyên Giáp",
        "type": "xa"
      },
      {
        "code": "8206",
        "name": "Xã Nguyễn Lương Bằng",
        "type": "xa"
      },
      {
        "code": "23054",
        "name": "Xã Ninh Giang",
        "type": "xa"
      },
      {
        "code": "29198",
        "name": "Xã Phú Thái",
        "type": "xa"
      },
      {
        "code": "5390",
        "name": "Xã Quyết Thắng",
        "type": "xa"
      },
      {
        "code": "23822",
        "name": "Xã Tân An",
        "type": "xa"
      },
      {
        "code": "6670",
        "name": "Xã Tân Kỳ",
        "type": "xa"
      },
      {
        "code": "1806",
        "name": "Xã Tân Minh",
        "type": "xa"
      },
      {
        "code": "20750",
        "name": "Xã Thái Tân",
        "type": "xa"
      },
      {
        "code": "21518",
        "name": "Xã Thanh Hà",
        "type": "xa"
      },
      {
        "code": "24334",
        "name": "Xã Thanh Miện",
        "type": "xa"
      },
      {
        "code": "3342",
        "name": "Xã Thượng Hồng",
        "type": "xa"
      },
      {
        "code": "15374",
        "name": "Xã Tiên Lãng",
        "type": "xa"
      },
      {
        "code": "5646",
        "name": "Xã Tiên Minh",
        "type": "xa"
      },
      {
        "code": "21006",
        "name": "Xã Trần Phú",
        "type": "xa"
      },
      {
        "code": "10766",
        "name": "Xã Trường Tân",
        "type": "xa"
      },
      {
        "code": "22286",
        "name": "Xã Tuệ Tĩnh",
        "type": "xa"
      },
      {
        "code": "22542",
        "name": "Xã Tứ Kỳ",
        "type": "xa"
      },
      {
        "code": "12814",
        "name": "Xã Việt Khê",
        "type": "xa"
      },
      {
        "code": "10510",
        "name": "Xã Vĩnh Am",
        "type": "xa"
      },
      {
        "code": "16142",
        "name": "Xã Vĩnh Bảo",
        "type": "xa"
      },
      {
        "code": "16654",
        "name": "Xã Vĩnh Hải",
        "type": "xa"
      },
      {
        "code": "16910",
        "name": "Xã Vĩnh Hòa",
        "type": "xa"
      },
      {
        "code": "23310",
        "name": "Xã Vĩnh Lại",
        "type": "xa"
      },
      {
        "code": "17166",
        "name": "Xã Vĩnh Thịnh",
        "type": "xa"
      },
      {
        "code": "17422",
        "name": "Xã Vĩnh Thuận",
        "type": "xa"
      },
      {
        "code": "28942",
        "name": "Xã Yết Kiêu",
        "type": "xa"
      }
    ]
  },
  {
    "code": "12",
    "name": "TP. Hồ Chí Minh",
    "wards": [
      {
        "code": "17676",
        "name": "Đặc Khu Côn Đảo",
        "type": "dac-khu"
      },
      {
        "code": "18956",
        "name": "Phường An Đông",
        "type": "phuong"
      },
      {
        "code": "25356",
        "name": "Phường An Hội Đông",
        "type": "phuong"
      },
      {
        "code": "25100",
        "name": "Phường An Hội Tây",
        "type": "phuong"
      },
      {
        "code": "11020",
        "name": "Phường An Khánh",
        "type": "phuong"
      },
      {
        "code": "23820",
        "name": "Phường An Lạc",
        "type": "phuong"
      },
      {
        "code": "24332",
        "name": "Phường An Nhơn",
        "type": "phuong"
      },
      {
        "code": "12556",
        "name": "Phường An Phú",
        "type": "phuong"
      },
      {
        "code": "22284",
        "name": "Phường An Phú Đông",
        "type": "phuong"
      },
      {
        "code": "34060",
        "name": "Phường Bà Rịa",
        "type": "phuong"
      },
      {
        "code": "2572",
        "name": "Phường Bàn Cờ",
        "type": "phuong"
      },
      {
        "code": "26636",
        "name": "Phường Bảy Hiền",
        "type": "phuong"
      },
      {
        "code": "14348",
        "name": "Phường Bến Cát",
        "type": "phuong"
      },
      {
        "code": "7948",
        "name": "Phường Bến Thành",
        "type": "phuong"
      },
      {
        "code": "40460",
        "name": "Phường Bình Cơ",
        "type": "phuong"
      },
      {
        "code": "41484",
        "name": "Phường Bình Dương",
        "type": "phuong"
      },
      {
        "code": "3084",
        "name": "Phường Bình Đông",
        "type": "phuong"
      },
      {
        "code": "11788",
        "name": "Phường Bình Hòa",
        "type": "phuong"
      },
      {
        "code": "18188",
        "name": "Phường Bình Hưng Hòa",
        "type": "phuong"
      },
      {
        "code": "23052",
        "name": "Phường Bình Lợi Trung",
        "type": "phuong"
      },
      {
        "code": "9228",
        "name": "Phường Bình Phú",
        "type": "phuong"
      },
      {
        "code": "23564",
        "name": "Phường Bình Quới",
        "type": "phuong"
      },
      {
        "code": "4876",
        "name": "Phường Bình Tân",
        "type": "phuong"
      },
      {
        "code": "32268",
        "name": "Phường Bình Tây",
        "type": "phuong"
      },
      {
        "code": "22796",
        "name": "Phường Bình Thạnh",
        "type": "phuong"
      },
      {
        "code": "8716",
        "name": "Phường Bình Thới",
        "type": "phuong"
      },
      {
        "code": "19468",
        "name": "Phường Bình Tiên",
        "type": "phuong"
      },
      {
        "code": "5132",
        "name": "Phường Bình Trị Đông",
        "type": "phuong"
      },
      {
        "code": "10764",
        "name": "Phường Bình Trưng",
        "type": "phuong"
      },
      {
        "code": "32012",
        "name": "Phường Cát Lái",
        "type": "phuong"
      },
      {
        "code": "6412",
        "name": "Phường Cầu Kiệu",
        "type": "phuong"
      },
      {
        "code": "7436",
        "name": "Phường Cầu Ông Lãnh",
        "type": "phuong"
      },
      {
        "code": "15628",
        "name": "Phường Chánh Hiệp",
        "type": "phuong"
      },
      {
        "code": "4108",
        "name": "Phường Chánh Hưng",
        "type": "phuong"
      },
      {
        "code": "42252",
        "name": "Phường Chánh Phú Hòa",
        "type": "phuong"
      },
      {
        "code": "19212",
        "name": "Phường Chợ Lớn",
        "type": "phuong"
      },
      {
        "code": "18700",
        "name": "Phường Chợ Quán",
        "type": "phuong"
      },
      {
        "code": "16908",
        "name": "Phường Dĩ An",
        "type": "phuong"
      },
      {
        "code": "8204",
        "name": "Phường Diên Hồng",
        "type": "phuong"
      },
      {
        "code": "42764",
        "name": "Phường Đông Hòa",
        "type": "phuong"
      },
      {
        "code": "21260",
        "name": "Phường Đông Hưng Thuận",
        "type": "phuong"
      },
      {
        "code": "25612",
        "name": "Phường Đức Nhuận",
        "type": "phuong"
      },
      {
        "code": "22540",
        "name": "Phường Gia Định",
        "type": "phuong"
      },
      {
        "code": "24588",
        "name": "Phường Gò Vấp",
        "type": "phuong"
      },
      {
        "code": "24076",
        "name": "Phường Hạnh Thông",
        "type": "phuong"
      },
      {
        "code": "10252",
        "name": "Phường Hiệp Bình",
        "type": "phuong"
      },
      {
        "code": "21004",
        "name": "Phường Hòa Bình",
        "type": "phuong"
      },
      {
        "code": "8460",
        "name": "Phường Hòa Hưng",
        "type": "phuong"
      },
      {
        "code": "41996",
        "name": "Phường Hòa Lợi",
        "type": "phuong"
      },
      {
        "code": "1036",
        "name": "Phường Khánh Hội",
        "type": "phuong"
      },
      {
        "code": "12300",
        "name": "Phường Lái Thiêu",
        "type": "phuong"
      },
      {
        "code": "10508",
        "name": "Phường Linh Xuân",
        "type": "phuong"
      },
      {
        "code": "4364",
        "name": "Phường Long Bình",
        "type": "phuong"
      },
      {
        "code": "34316",
        "name": "Phường Long Hương",
        "type": "phuong"
      },
      {
        "code": "13836",
        "name": "Phường Long Nguyên",
        "type": "phuong"
      },
      {
        "code": "31500",
        "name": "Phường Long Phước",
        "type": "phuong"
      },
      {
        "code": "31756",
        "name": "Phường Long Trường",
        "type": "phuong"
      },
      {
        "code": "20748",
        "name": "Phường Minh Phụng",
        "type": "phuong"
      },
      {
        "code": "18444",
        "name": "Phường Nhiêu Lộc",
        "type": "phuong"
      },
      {
        "code": "11276",
        "name": "Phường Phú An",
        "type": "phuong"
      },
      {
        "code": "3852",
        "name": "Phường Phú Định",
        "type": "phuong"
      },
      {
        "code": "19724",
        "name": "Phường Phú Lâm",
        "type": "phuong"
      },
      {
        "code": "17420",
        "name": "Phường Phú Lợi",
        "type": "phuong"
      },
      {
        "code": "34828",
        "name": "Phường Phú Mỹ",
        "type": "phuong"
      },
      {
        "code": "6156",
        "name": "Phường Phú Nhuận",
        "type": "phuong"
      },
      {
        "code": "6924",
        "name": "Phường Phú Thạnh",
        "type": "phuong"
      },
      {
        "code": "8972",
        "name": "Phường Phú Thọ",
        "type": "phuong"
      },
      {
        "code": "32780",
        "name": "Phường Phú Thọ Hòa",
        "type": "phuong"
      },
      {
        "code": "3340",
        "name": "Phường Phú Thuận",
        "type": "phuong"
      },
      {
        "code": "31244",
        "name": "Phường Phước Long",
        "type": "phuong"
      },
      {
        "code": "33804",
        "name": "Phường Phước Thắng",
        "type": "phuong"
      },
      {
        "code": "12812",
        "name": "Phường Rạch Dừa",
        "type": "phuong"
      },
      {
        "code": "7692",
        "name": "Phường Sài Gòn",
        "type": "phuong"
      },
      {
        "code": "30988",
        "name": "Phường Tam Bình",
        "type": "phuong"
      },
      {
        "code": "34572",
        "name": "Phường Tam Long",
        "type": "phuong"
      },
      {
        "code": "33548",
        "name": "Phường Tam Thắng",
        "type": "phuong"
      },
      {
        "code": "4620",
        "name": "Phường Tăng Nhơn Phú",
        "type": "phuong"
      },
      {
        "code": "6668",
        "name": "Phường Tân Bình",
        "type": "phuong"
      },
      {
        "code": "7180",
        "name": "Phường Tân Định",
        "type": "phuong"
      },
      {
        "code": "17164",
        "name": "Phường Tân Đông Hiệp",
        "type": "phuong"
      },
      {
        "code": "35596",
        "name": "Phường Tân Hải",
        "type": "phuong"
      },
      {
        "code": "41740",
        "name": "Phường Tân Hiệp",
        "type": "phuong"
      },
      {
        "code": "26380",
        "name": "Phường Tân Hòa",
        "type": "phuong"
      },
      {
        "code": "19980",
        "name": "Phường Tân Hưng",
        "type": "phuong"
      },
      {
        "code": "14860",
        "name": "Phường Tân Khánh",
        "type": "phuong"
      },
      {
        "code": "3596",
        "name": "Phường Tân Mỹ",
        "type": "phuong"
      },
      {
        "code": "33036",
        "name": "Phường Tân Phú",
        "type": "phuong"
      },
      {
        "code": "35340",
        "name": "Phường Tân Phước",
        "type": "phuong"
      },
      {
        "code": "32524",
        "name": "Phường Tân Sơn",
        "type": "phuong"
      },
      {
        "code": "25868",
        "name": "Phường Tân Sơn Hòa",
        "type": "phuong"
      },
      {
        "code": "26124",
        "name": "Phường Tân Sơn Nhất",
        "type": "phuong"
      },
      {
        "code": "9484",
        "name": "Phường Tân Sơn Nhì",
        "type": "phuong"
      },
      {
        "code": "13580",
        "name": "Phường Tân Tạo",
        "type": "phuong"
      },
      {
        "code": "35084",
        "name": "Phường Tân Thành",
        "type": "phuong"
      },
      {
        "code": "21772",
        "name": "Phường Tân Thới Hiệp",
        "type": "phuong"
      },
      {
        "code": "20236",
        "name": "Phường Tân Thuận",
        "type": "phuong"
      },
      {
        "code": "15116",
        "name": "Phường Tân Uyên",
        "type": "phuong"
      },
      {
        "code": "16140",
        "name": "Phường Tây Nam",
        "type": "phuong"
      },
      {
        "code": "9740",
        "name": "Phường Tây Thạnh",
        "type": "phuong"
      },
      {
        "code": "23308",
        "name": "Phường Thạnh Mỹ Tây",
        "type": "phuong"
      },
      {
        "code": "24844",
        "name": "Phường Thông Tây Hội",
        "type": "phuong"
      },
      {
        "code": "22028",
        "name": "Phường Thới An",
        "type": "phuong"
      },
      {
        "code": "15884",
        "name": "Phường Thới Hòa",
        "type": "phuong"
      },
      {
        "code": "12044",
        "name": "Phường Thủ Dầu Một",
        "type": "phuong"
      },
      {
        "code": "9996",
        "name": "Phường Thủ Đức",
        "type": "phuong"
      },
      {
        "code": "43020",
        "name": "Phường Thuận An",
        "type": "phuong"
      },
      {
        "code": "11532",
        "name": "Phường Thuận Giao",
        "type": "phuong"
      },
      {
        "code": "21516",
        "name": "Phường Trung Mỹ Tây",
        "type": "phuong"
      },
      {
        "code": "780",
        "name": "Phường Vĩnh Hội",
        "type": "phuong"
      },
      {
        "code": "42508",
        "name": "Phường Vĩnh Tân",
        "type": "phuong"
      },
      {
        "code": "40204",
        "name": "Phường Vũng Tàu",
        "type": "phuong"
      },
      {
        "code": "20492",
        "name": "Phường Vườn Lài",
        "type": "phuong"
      },
      {
        "code": "524",
        "name": "Phường Xóm Chiếu",
        "type": "phuong"
      },
      {
        "code": "2828",
        "name": "Phường Xuân Hòa",
        "type": "phuong"
      },
      {
        "code": "40972",
        "name": "Xã An Long",
        "type": "xa"
      },
      {
        "code": "27404",
        "name": "Xã An Nhơn Tây",
        "type": "xa"
      },
      {
        "code": "2060",
        "name": "Xã An Thới Đông",
        "type": "xa"
      },
      {
        "code": "30220",
        "name": "Xã Bà Điểm",
        "type": "xa"
      },
      {
        "code": "33292",
        "name": "Xã Bàu Bàng",
        "type": "xa"
      },
      {
        "code": "38412",
        "name": "Xã Bàu Lâm",
        "type": "xa"
      },
      {
        "code": "40716",
        "name": "Xã Bắc Tân Uyên",
        "type": "xa"
      },
      {
        "code": "1292",
        "name": "Xã Bình Chánh",
        "type": "xa"
      },
      {
        "code": "39948",
        "name": "Xã Bình Châu",
        "type": "xa"
      },
      {
        "code": "36364",
        "name": "Xã Bình Giã",
        "type": "xa"
      },
      {
        "code": "5644",
        "name": "Xã Bình Hưng",
        "type": "xa"
      },
      {
        "code": "2316",
        "name": "Xã Bình Khánh",
        "type": "xa"
      },
      {
        "code": "26892",
        "name": "Xã Bình Lợi",
        "type": "xa"
      },
      {
        "code": "28940",
        "name": "Xã Bình Mỹ",
        "type": "xa"
      },
      {
        "code": "29196",
        "name": "Xã Cần Giờ",
        "type": "xa"
      },
      {
        "code": "36876",
        "name": "Xã Châu Đức",
        "type": "xa"
      },
      {
        "code": "35852",
        "name": "Xã Châu Pha",
        "type": "xa"
      },
      {
        "code": "28428",
        "name": "Xã Củ Chi",
        "type": "xa"
      },
      {
        "code": "14604",
        "name": "Xã Dầu Tiếng",
        "type": "xa"
      },
      {
        "code": "38668",
        "name": "Xã Đất Đỏ",
        "type": "xa"
      },
      {
        "code": "29452",
        "name": "Xã Đông Thạnh",
        "type": "xa"
      },
      {
        "code": "30732",
        "name": "Xã Hiệp Phước",
        "type": "xa"
      },
      {
        "code": "39692",
        "name": "Xã Hòa Hiệp",
        "type": "xa"
      },
      {
        "code": "38156",
        "name": "Xã Hòa Hội",
        "type": "xa"
      },
      {
        "code": "29708",
        "name": "Xã Hóc Môn",
        "type": "xa"
      },
      {
        "code": "37644",
        "name": "Xã Hồ Tràm",
        "type": "xa"
      },
      {
        "code": "27148",
        "name": "Xã Hưng Long",
        "type": "xa"
      },
      {
        "code": "36620",
        "name": "Xã Kim Long",
        "type": "xa"
      },
      {
        "code": "17932",
        "name": "Xã Long Điền",
        "type": "xa"
      },
      {
        "code": "38924",
        "name": "Xã Long Hải",
        "type": "xa"
      },
      {
        "code": "13068",
        "name": "Xã Long Hòa",
        "type": "xa"
      },
      {
        "code": "39436",
        "name": "Xã Long Sơn",
        "type": "xa"
      },
      {
        "code": "13324",
        "name": "Xã Minh Thạnh",
        "type": "xa"
      },
      {
        "code": "36108",
        "name": "Xã Ngãi Giao",
        "type": "xa"
      },
      {
        "code": "37388",
        "name": "Xã Nghĩa Thành",
        "type": "xa"
      },
      {
        "code": "30476",
        "name": "Xã Nhà Bè",
        "type": "xa"
      },
      {
        "code": "27916",
        "name": "Xã Nhuận Đức",
        "type": "xa"
      },
      {
        "code": "5388",
        "name": "Xã Phú Giáo",
        "type": "xa"
      },
      {
        "code": "28684",
        "name": "Xã Phú Hòa Đông",
        "type": "xa"
      },
      {
        "code": "39180",
        "name": "Xã Phước Hải",
        "type": "xa"
      },
      {
        "code": "15372",
        "name": "Xã Phước Hòa",
        "type": "xa"
      },
      {
        "code": "41228",
        "name": "Xã Phước Thành",
        "type": "xa"
      },
      {
        "code": "28172",
        "name": "Xã Tân An Hội",
        "type": "xa"
      },
      {
        "code": "16652",
        "name": "Xã Tân Nhựt",
        "type": "xa"
      },
      {
        "code": "1804",
        "name": "Xã Tân Vĩnh Lộc",
        "type": "xa"
      },
      {
        "code": "27660",
        "name": "Xã Thái Mỹ",
        "type": "xa"
      },
      {
        "code": "16396",
        "name": "Xã Thanh An",
        "type": "xa"
      },
      {
        "code": "268",
        "name": "Xã Thạnh An",
        "type": "xa"
      },
      {
        "code": "5900",
        "name": "Xã Thường Tân",
        "type": "xa"
      },
      {
        "code": "14092",
        "name": "Xã Trừ Văn Thố",
        "type": "xa"
      },
      {
        "code": "1548",
        "name": "Xã Vĩnh Lộc",
        "type": "xa"
      },
      {
        "code": "37132",
        "name": "Xã Xuân Sơn",
        "type": "xa"
      },
      {
        "code": "29964",
        "name": "Xã Xuân Thới Sơn",
        "type": "xa"
      },
      {
        "code": "37900",
        "name": "Xã Xuyên Mộc",
        "type": "xa"
      }
    ]
  },
  {
    "code": "16",
    "name": "TP. Huế",
    "wards": [
      {
        "code": "5136",
        "name": "Phường An Cựu",
        "type": "phuong"
      },
      {
        "code": "272",
        "name": "Phường Dương Nỗ",
        "type": "phuong"
      },
      {
        "code": "4112",
        "name": "Phường Hóa Châu",
        "type": "phuong"
      },
      {
        "code": "3344",
        "name": "Phường Hương An",
        "type": "phuong"
      },
      {
        "code": "6672",
        "name": "Phường Hương Thủy",
        "type": "phuong"
      },
      {
        "code": "2320",
        "name": "Phường Hương Trà",
        "type": "phuong"
      },
      {
        "code": "3088",
        "name": "Phường Kim Long",
        "type": "phuong"
      },
      {
        "code": "2576",
        "name": "Phường Kim Trà",
        "type": "phuong"
      },
      {
        "code": "4368",
        "name": "Phường Mỹ Thượng",
        "type": "phuong"
      },
      {
        "code": "1040",
        "name": "Phường Phong Dinh",
        "type": "phuong"
      },
      {
        "code": "528",
        "name": "Phường Phong Điền",
        "type": "phuong"
      },
      {
        "code": "1296",
        "name": "Phường Phong Phú",
        "type": "phuong"
      },
      {
        "code": "1552",
        "name": "Phường Phong Quảng",
        "type": "phuong"
      },
      {
        "code": "784",
        "name": "Phường Phong Thái",
        "type": "phuong"
      },
      {
        "code": "6928",
        "name": "Phường Phú Bài",
        "type": "phuong"
      },
      {
        "code": "3600",
        "name": "Phường Phú Xuân",
        "type": "phuong"
      },
      {
        "code": "6416",
        "name": "Phường Thanh Thủy",
        "type": "phuong"
      },
      {
        "code": "3856",
        "name": "Phường Thuận An",
        "type": "phuong"
      },
      {
        "code": "4880",
        "name": "Phường Thuận Hóa",
        "type": "phuong"
      },
      {
        "code": "5392",
        "name": "Phường Thủy Xuân",
        "type": "phuong"
      },
      {
        "code": "4624",
        "name": "Phường Vỹ Dạ",
        "type": "phuong"
      },
      {
        "code": "9232",
        "name": "Xã A Lưới 1",
        "type": "xa"
      },
      {
        "code": "9488",
        "name": "Xã A Lưới 2",
        "type": "xa"
      },
      {
        "code": "9744",
        "name": "Xã A Lưới 3",
        "type": "xa"
      },
      {
        "code": "10000",
        "name": "Xã A Lưới 4",
        "type": "xa"
      },
      {
        "code": "10256",
        "name": "Xã A Lưới 5",
        "type": "xa"
      },
      {
        "code": "2832",
        "name": "Xã Bình Điền",
        "type": "xa"
      },
      {
        "code": "8208",
        "name": "Xã Chân Mây-Lăng Cô",
        "type": "xa"
      },
      {
        "code": "1808",
        "name": "Xã Đan Điền",
        "type": "xa"
      },
      {
        "code": "7440",
        "name": "Xã Hưng Lộc",
        "type": "xa"
      },
      {
        "code": "8976",
        "name": "Xã Khe Tre",
        "type": "xa"
      },
      {
        "code": "8464",
        "name": "Xã Long Quảng",
        "type": "xa"
      },
      {
        "code": "7696",
        "name": "Xã Lộc An",
        "type": "xa"
      },
      {
        "code": "8720",
        "name": "Xã Nam Đông",
        "type": "xa"
      },
      {
        "code": "5904",
        "name": "Xã Phú Hồ",
        "type": "xa"
      },
      {
        "code": "7952",
        "name": "Xã Phú Lộc",
        "type": "xa"
      },
      {
        "code": "6160",
        "name": "Xã Phú Vang",
        "type": "xa"
      },
      {
        "code": "5648",
        "name": "Xã Phú Vinh",
        "type": "xa"
      },
      {
        "code": "2064",
        "name": "Xã Quảng Điền",
        "type": "xa"
      },
      {
        "code": "7184",
        "name": "Xã Vinh Lộc",
        "type": "xa"
      }
    ]
  },
  {
    "code": "43",
    "name": "Tuyên Quang",
    "wards": [
      {
        "code": "31531",
        "name": "Phường An Tường",
        "type": "phuong"
      },
      {
        "code": "31787",
        "name": "Phường Bình Thuận",
        "type": "phuong"
      },
      {
        "code": "4395",
        "name": "Phường Hà Giang 1",
        "type": "phuong"
      },
      {
        "code": "1323",
        "name": "Phường Hà Giang 2",
        "type": "phuong"
      },
      {
        "code": "5163",
        "name": "Phường Minh Xuân",
        "type": "phuong"
      },
      {
        "code": "6187",
        "name": "Phường Mỹ Lâm",
        "type": "phuong"
      },
      {
        "code": "4907",
        "name": "Phường Nông Tiến",
        "type": "phuong"
      },
      {
        "code": "11563",
        "name": "Xã Bạch Đích",
        "type": "xa"
      },
      {
        "code": "15915",
        "name": "Xã Bạch Ngọc",
        "type": "xa"
      },
      {
        "code": "25643",
        "name": "Xã Bạch Xa",
        "type": "xa"
      },
      {
        "code": "7211",
        "name": "Xã Bản Máy",
        "type": "xa"
      },
      {
        "code": "14635",
        "name": "Xã Bắc Mê",
        "type": "xa"
      },
      {
        "code": "17195",
        "name": "Xã Bắc Quang",
        "type": "xa"
      },
      {
        "code": "16939",
        "name": "Xã Bằng Hành",
        "type": "xa"
      },
      {
        "code": "18731",
        "name": "Xã Bằng Lang",
        "type": "xa"
      },
      {
        "code": "21547",
        "name": "Xã Bình An",
        "type": "xa"
      },
      {
        "code": "29739",
        "name": "Xã Bình Ca",
        "type": "xa"
      },
      {
        "code": "26411",
        "name": "Xã Bình Xa",
        "type": "xa"
      },
      {
        "code": "13099",
        "name": "Xã Cán Tỷ",
        "type": "xa"
      },
      {
        "code": "2347",
        "name": "Xã Cao Bồ",
        "type": "xa"
      },
      {
        "code": "23851",
        "name": "Xã Chiêm Hóa",
        "type": "xa"
      },
      {
        "code": "21803",
        "name": "Xã Côn Lôn",
        "type": "xa"
      },
      {
        "code": "12331",
        "name": "Xã Du Già",
        "type": "xa"
      },
      {
        "code": "16427",
        "name": "Xã Đồng Tâm",
        "type": "xa"
      },
      {
        "code": "31275",
        "name": "Xã Đông Thọ",
        "type": "xa"
      },
      {
        "code": "555",
        "name": "Xã Đồng Văn",
        "type": "xa"
      },
      {
        "code": "17963",
        "name": "Xã Đồng Yên",
        "type": "xa"
      },
      {
        "code": "14379",
        "name": "Xã Đường Hồng",
        "type": "xa"
      },
      {
        "code": "12587",
        "name": "Xã Đường Thượng",
        "type": "xa"
      },
      {
        "code": "1067",
        "name": "Xã Giáp Trung",
        "type": "xa"
      },
      {
        "code": "26155",
        "name": "Xã Hàm Yên",
        "type": "xa"
      },
      {
        "code": "24107",
        "name": "Xã Hòa An",
        "type": "xa"
      },
      {
        "code": "6699",
        "name": "Xã Hoàng Su Phì",
        "type": "xa"
      },
      {
        "code": "20011",
        "name": "Xã Hồ Thầu",
        "type": "xa"
      },
      {
        "code": "31019",
        "name": "Xã Hồng Sơn",
        "type": "xa"
      },
      {
        "code": "22571",
        "name": "Xã Hồng Thái",
        "type": "xa"
      },
      {
        "code": "17451",
        "name": "Xã Hùng An",
        "type": "xa"
      },
      {
        "code": "5675",
        "name": "Xã Hùng Đức",
        "type": "xa"
      },
      {
        "code": "27179",
        "name": "Xã Hùng Lợi",
        "type": "xa"
      },
      {
        "code": "10539",
        "name": "Xã Khâu Vai",
        "type": "xa"
      },
      {
        "code": "8747",
        "name": "Xã Khuôn Lùng",
        "type": "xa"
      },
      {
        "code": "24363",
        "name": "Xã Kiên Đài",
        "type": "xa"
      },
      {
        "code": "5931",
        "name": "Xã Kiến Thiết",
        "type": "xa"
      },
      {
        "code": "24875",
        "name": "Xã Kim Bình",
        "type": "xa"
      },
      {
        "code": "14891",
        "name": "Xã Lao Chải",
        "type": "xa"
      },
      {
        "code": "21035",
        "name": "Xã Lâm Bình",
        "type": "xa"
      },
      {
        "code": "16683",
        "name": "Xã Liên Hiệp",
        "type": "xa"
      },
      {
        "code": "15659",
        "name": "Xã Linh Hồ",
        "type": "xa"
      },
      {
        "code": "9003",
        "name": "Xã Lũng Cú",
        "type": "xa"
      },
      {
        "code": "9771",
        "name": "Xã Lũng Phìn",
        "type": "xa"
      },
      {
        "code": "12843",
        "name": "Xã Lùng Tám",
        "type": "xa"
      },
      {
        "code": "28203",
        "name": "Xã Lực Hành",
        "type": "xa"
      },
      {
        "code": "12075",
        "name": "Xã Mậu Duệ",
        "type": "xa"
      },
      {
        "code": "2603",
        "name": "Xã Mèo Vạc",
        "type": "xa"
      },
      {
        "code": "4139",
        "name": "Xã Minh Ngọc",
        "type": "xa"
      },
      {
        "code": "21291",
        "name": "Xã Minh Quang",
        "type": "xa"
      },
      {
        "code": "811",
        "name": "Xã Minh Sơn",
        "type": "xa"
      },
      {
        "code": "4651",
        "name": "Xã Minh Tân",
        "type": "xa"
      },
      {
        "code": "29227",
        "name": "Xã Minh Thanh",
        "type": "xa"
      },
      {
        "code": "22827",
        "name": "Xã Nà Hang",
        "type": "xa"
      },
      {
        "code": "8235",
        "name": "Xã Nấm Dẩn",
        "type": "xa"
      },
      {
        "code": "20267",
        "name": "Xã Nậm Dịch",
        "type": "xa"
      },
      {
        "code": "13355",
        "name": "Xã Nghĩa Thuận",
        "type": "xa"
      },
      {
        "code": "1579",
        "name": "Xã Ngọc Đường",
        "type": "xa"
      },
      {
        "code": "299",
        "name": "Xã Ngọc Long",
        "type": "xa"
      },
      {
        "code": "28715",
        "name": "Xã Nhữ Khê",
        "type": "xa"
      },
      {
        "code": "10795",
        "name": "Xã Niêm Sơn",
        "type": "xa"
      },
      {
        "code": "7979",
        "name": "Xã Pà Vầy Sủ",
        "type": "xa"
      },
      {
        "code": "9515",
        "name": "Xã Phố Bảng",
        "type": "xa"
      },
      {
        "code": "15403",
        "name": "Xã Phú Linh",
        "type": "xa"
      },
      {
        "code": "30507",
        "name": "Xã Phú Lương",
        "type": "xa"
      },
      {
        "code": "25899",
        "name": "Xã Phù Lưu",
        "type": "xa"
      },
      {
        "code": "7467",
        "name": "Xã Pờ Ly Ngài",
        "type": "xa"
      },
      {
        "code": "13611",
        "name": "Xã Quản Bạ",
        "type": "xa"
      },
      {
        "code": "19243",
        "name": "Xã Quang Bình",
        "type": "xa"
      },
      {
        "code": "3883",
        "name": "Xã Quảng Nguyên",
        "type": "xa"
      },
      {
        "code": "9259",
        "name": "Xã Sà Phìn",
        "type": "xa"
      },
      {
        "code": "29483",
        "name": "Xã Sơn Dương",
        "type": "xa"
      },
      {
        "code": "30251",
        "name": "Xã Sơn Thủy",
        "type": "xa"
      },
      {
        "code": "10283",
        "name": "Xã Sơn Vĩ",
        "type": "xa"
      },
      {
        "code": "10027",
        "name": "Xã Sủng Máng",
        "type": "xa"
      },
      {
        "code": "11051",
        "name": "Xã Tát Ngà",
        "type": "xa"
      },
      {
        "code": "23595",
        "name": "Xã Tân An",
        "type": "xa"
      },
      {
        "code": "27691",
        "name": "Xã Tân Long",
        "type": "xa"
      },
      {
        "code": "23083",
        "name": "Xã Tân Mỹ",
        "type": "xa"
      },
      {
        "code": "16171",
        "name": "Xã Tân Quang",
        "type": "xa"
      },
      {
        "code": "29995",
        "name": "Xã Tân Thanh",
        "type": "xa"
      },
      {
        "code": "6443",
        "name": "Xã Tân Tiến",
        "type": "xa"
      },
      {
        "code": "28971",
        "name": "Xã Tân Trào",
        "type": "xa"
      },
      {
        "code": "19499",
        "name": "Xã Tân Trịnh",
        "type": "xa"
      },
      {
        "code": "20523",
        "name": "Xã Thái Bình",
        "type": "xa"
      },
      {
        "code": "26923",
        "name": "Xã Thái Hòa",
        "type": "xa"
      },
      {
        "code": "26667",
        "name": "Xã Thái Sơn",
        "type": "xa"
      },
      {
        "code": "6955",
        "name": "Xã Thàng Tín",
        "type": "xa"
      },
      {
        "code": "15147",
        "name": "Xã Thanh Thủy",
        "type": "xa"
      },
      {
        "code": "11307",
        "name": "Xã Thắng Mố",
        "type": "xa"
      },
      {
        "code": "19755",
        "name": "Xã Thông Nguyên",
        "type": "xa"
      },
      {
        "code": "2859",
        "name": "Xã Thuận Hòa",
        "type": "xa"
      },
      {
        "code": "20779",
        "name": "Xã Thượng Lâm",
        "type": "xa"
      },
      {
        "code": "22315",
        "name": "Xã Thượng Nông",
        "type": "xa"
      },
      {
        "code": "3115",
        "name": "Xã Thượng Sơn",
        "type": "xa"
      },
      {
        "code": "1835",
        "name": "Xã Tiên Nguyên",
        "type": "xa"
      },
      {
        "code": "18219",
        "name": "Xã Tiên Yên",
        "type": "xa"
      },
      {
        "code": "24619",
        "name": "Xã Tri Phú",
        "type": "xa"
      },
      {
        "code": "5419",
        "name": "Xã Trung Hà",
        "type": "xa"
      },
      {
        "code": "27435",
        "name": "Xã Trung Sơn",
        "type": "xa"
      },
      {
        "code": "8491",
        "name": "Xã Trung Thịnh",
        "type": "xa"
      },
      {
        "code": "30763",
        "name": "Xã Trường Sinh",
        "type": "xa"
      },
      {
        "code": "3371",
        "name": "Xã Tùng Bá",
        "type": "xa"
      },
      {
        "code": "13867",
        "name": "Xã Tùng Vài",
        "type": "xa"
      },
      {
        "code": "2091",
        "name": "Xã Vị Xuyên",
        "type": "xa"
      },
      {
        "code": "3627",
        "name": "Xã Việt Lâm",
        "type": "xa"
      },
      {
        "code": "17707",
        "name": "Xã Vĩnh Tuy",
        "type": "xa"
      },
      {
        "code": "7723",
        "name": "Xã Xín Mần",
        "type": "xa"
      },
      {
        "code": "18475",
        "name": "Xã Xuân Giang",
        "type": "xa"
      },
      {
        "code": "27947",
        "name": "Xã Xuân Vân",
        "type": "xa"
      },
      {
        "code": "14123",
        "name": "Xã Yên Cường",
        "type": "xa"
      },
      {
        "code": "22059",
        "name": "Xã Yên Hoa",
        "type": "xa"
      },
      {
        "code": "23339",
        "name": "Xã Yên Lập",
        "type": "xa"
      },
      {
        "code": "11819",
        "name": "Xã Yên Minh",
        "type": "xa"
      },
      {
        "code": "25131",
        "name": "Xã Yên Nguyên",
        "type": "xa"
      },
      {
        "code": "25387",
        "name": "Xã Yên Phú",
        "type": "xa"
      },
      {
        "code": "28459",
        "name": "Xã Yên Sơn",
        "type": "xa"
      },
      {
        "code": "18987",
        "name": "Xã Yên Thành",
        "type": "xa"
      }
    ]
  },
  {
    "code": "44",
    "name": "Vĩnh Long",
    "wards": [
      {
        "code": "19756",
        "name": "Phường An Hội",
        "type": "phuong"
      },
      {
        "code": "20268",
        "name": "Phường Bến Tre",
        "type": "phuong"
      },
      {
        "code": "1836",
        "name": "Phường Bình Minh",
        "type": "phuong"
      },
      {
        "code": "1580",
        "name": "Phường Cái Vồn",
        "type": "phuong"
      },
      {
        "code": "18476",
        "name": "Phường Duyên Hải",
        "type": "phuong"
      },
      {
        "code": "10284",
        "name": "Phường Đông Thành",
        "type": "phuong"
      },
      {
        "code": "11308",
        "name": "Phường Hòa Thuận",
        "type": "phuong"
      },
      {
        "code": "5164",
        "name": "Phường Long Châu",
        "type": "phuong"
      },
      {
        "code": "10796",
        "name": "Phường Long Đức",
        "type": "phuong"
      },
      {
        "code": "11052",
        "name": "Phường Nguyệt Hóa",
        "type": "phuong"
      },
      {
        "code": "20012",
        "name": "Phường Phú Khương",
        "type": "phuong"
      },
      {
        "code": "20780",
        "name": "Phường Phú Tân",
        "type": "phuong"
      },
      {
        "code": "5420",
        "name": "Phường Phước Hậu",
        "type": "phuong"
      },
      {
        "code": "20524",
        "name": "Phường Sơn Đông",
        "type": "phuong"
      },
      {
        "code": "5676",
        "name": "Phường Tân Hạnh",
        "type": "phuong"
      },
      {
        "code": "5932",
        "name": "Phường Tân Ngãi",
        "type": "phuong"
      },
      {
        "code": "4908",
        "name": "Phường Thanh Đức",
        "type": "phuong"
      },
      {
        "code": "10540",
        "name": "Phường Trà Vinh",
        "type": "phuong"
      },
      {
        "code": "18732",
        "name": "Phường Trường Long Hòa",
        "type": "phuong"
      },
      {
        "code": "4140",
        "name": "Xã An Bình",
        "type": "xa"
      },
      {
        "code": "24620",
        "name": "Xã An Định",
        "type": "xa"
      },
      {
        "code": "28204",
        "name": "Xã An Hiệp",
        "type": "xa"
      },
      {
        "code": "27948",
        "name": "Xã An Ngãi Trung",
        "type": "xa"
      },
      {
        "code": "14124",
        "name": "Xã An Phú Tân",
        "type": "xa"
      },
      {
        "code": "25900",
        "name": "Xã An Qui",
        "type": "xa"
      },
      {
        "code": "11820",
        "name": "Xã An Trường",
        "type": "xa"
      },
      {
        "code": "27180",
        "name": "Xã Ba Tri",
        "type": "xa"
      },
      {
        "code": "26924",
        "name": "Xã Bảo Thạnh",
        "type": "xa"
      },
      {
        "code": "30764",
        "name": "Xã Bình Đại",
        "type": "xa"
      },
      {
        "code": "12588",
        "name": "Xã Bình Phú",
        "type": "xa"
      },
      {
        "code": "3884",
        "name": "Xã Bình Phước",
        "type": "xa"
      },
      {
        "code": "9260",
        "name": "Xã Cái Ngang",
        "type": "xa"
      },
      {
        "code": "3116",
        "name": "Xã Cái Nhum",
        "type": "xa"
      },
      {
        "code": "11564",
        "name": "Xã Càng Long",
        "type": "xa"
      },
      {
        "code": "13612",
        "name": "Xã Cầu Kè",
        "type": "xa"
      },
      {
        "code": "15660",
        "name": "Xã Cầu Ngang",
        "type": "xa"
      },
      {
        "code": "29740",
        "name": "Xã Châu Hòa",
        "type": "xa"
      },
      {
        "code": "31532",
        "name": "Xã Châu Hưng",
        "type": "xa"
      },
      {
        "code": "12844",
        "name": "Xã Châu Thành",
        "type": "xa"
      },
      {
        "code": "22316",
        "name": "Xã Chợ Lách",
        "type": "xa"
      },
      {
        "code": "17196",
        "name": "Xã Đại An",
        "type": "xa"
      },
      {
        "code": "25132",
        "name": "Xã Đại Điền",
        "type": "xa"
      },
      {
        "code": "19244",
        "name": "Xã Đôn Châu",
        "type": "xa"
      },
      {
        "code": "812",
        "name": "Xã Đông Hải",
        "type": "xa"
      },
      {
        "code": "23852",
        "name": "Xã Đồng Khởi",
        "type": "xa"
      },
      {
        "code": "21292",
        "name": "Xã Giao Long",
        "type": "xa"
      },
      {
        "code": "28716",
        "name": "Xã Giồng Trôm",
        "type": "xa"
      },
      {
        "code": "17708",
        "name": "Xã Hàm Giang",
        "type": "xa"
      },
      {
        "code": "16684",
        "name": "Xã Hiệp Mỹ",
        "type": "xa"
      },
      {
        "code": "7468",
        "name": "Xã Hiếu Phụng",
        "type": "xa"
      },
      {
        "code": "7724",
        "name": "Xã Hiếu Thành",
        "type": "xa"
      },
      {
        "code": "8492",
        "name": "Xã Hòa Bình",
        "type": "xa"
      },
      {
        "code": "8748",
        "name": "Xã Hòa Hiệp",
        "type": "xa"
      },
      {
        "code": "300",
        "name": "Xã Hòa Minh",
        "type": "xa"
      },
      {
        "code": "15148",
        "name": "Xã Hùng Hòa",
        "type": "xa"
      },
      {
        "code": "22828",
        "name": "Xã Hưng Khánh Trung",
        "type": "xa"
      },
      {
        "code": "13356",
        "name": "Xã Hưng Mỹ",
        "type": "xa"
      },
      {
        "code": "28460",
        "name": "Xã Hưng Nhượng",
        "type": "xa"
      },
      {
        "code": "24876",
        "name": "Xã Hương Mỹ",
        "type": "xa"
      },
      {
        "code": "17964",
        "name": "Xã Long Hiệp",
        "type": "xa"
      },
      {
        "code": "556",
        "name": "Xã Long Hòa",
        "type": "xa"
      },
      {
        "code": "4396",
        "name": "Xã Long Hồ",
        "type": "xa"
      },
      {
        "code": "1068",
        "name": "Xã Long Hữu",
        "type": "xa"
      },
      {
        "code": "18988",
        "name": "Xã Long Thành",
        "type": "xa"
      },
      {
        "code": "1324",
        "name": "Xã Long Vĩnh",
        "type": "xa"
      },
      {
        "code": "31276",
        "name": "Xã Lộc Thuận",
        "type": "xa"
      },
      {
        "code": "7980",
        "name": "Xã Lục Sĩ Thành",
        "type": "xa"
      },
      {
        "code": "29996",
        "name": "Xã Lương Hòa",
        "type": "xa"
      },
      {
        "code": "29484",
        "name": "Xã Lương Phú",
        "type": "xa"
      },
      {
        "code": "17452",
        "name": "Xã Lưu Nghiệp Anh",
        "type": "xa"
      },
      {
        "code": "24108",
        "name": "Xã Mỏ Cày",
        "type": "xa"
      },
      {
        "code": "27692",
        "name": "Xã Mỹ Chánh Hòa",
        "type": "xa"
      },
      {
        "code": "15916",
        "name": "Xã Mỹ Long",
        "type": "xa"
      },
      {
        "code": "10028",
        "name": "Xã Mỹ Thuận",
        "type": "xa"
      },
      {
        "code": "2348",
        "name": "Xã Ngãi Tứ",
        "type": "xa"
      },
      {
        "code": "19500",
        "name": "Xã Ngũ Lạc",
        "type": "xa"
      },
      {
        "code": "12332",
        "name": "Xã Nhị Long",
        "type": "xa"
      },
      {
        "code": "16428",
        "name": "Xã Nhị Trường",
        "type": "xa"
      },
      {
        "code": "3628",
        "name": "Xã Nhơn Phú",
        "type": "xa"
      },
      {
        "code": "23596",
        "name": "Xã Nhuận Phú Tân",
        "type": "xa"
      },
      {
        "code": "13868",
        "name": "Xã Phong Thạnh",
        "type": "xa"
      },
      {
        "code": "22060",
        "name": "Xã Phú Phụng",
        "type": "xa"
      },
      {
        "code": "4652",
        "name": "Xã Phú Quới",
        "type": "xa"
      },
      {
        "code": "31788",
        "name": "Xã Phú Thuận",
        "type": "xa"
      },
      {
        "code": "21036",
        "name": "Xã Phú Túc",
        "type": "xa"
      },
      {
        "code": "29228",
        "name": "Xã Phước Long",
        "type": "xa"
      },
      {
        "code": "23084",
        "name": "Xã Phước Mỹ Trung",
        "type": "xa"
      },
      {
        "code": "6956",
        "name": "Xã Quới An",
        "type": "xa"
      },
      {
        "code": "25388",
        "name": "Xã Quới Điền",
        "type": "xa"
      },
      {
        "code": "6188",
        "name": "Xã Quới Thiện",
        "type": "xa"
      },
      {
        "code": "13100",
        "name": "Xã Song Lộc",
        "type": "xa"
      },
      {
        "code": "9004",
        "name": "Xã Song Phú",
        "type": "xa"
      },
      {
        "code": "2092",
        "name": "Xã Tam Bình",
        "type": "xa"
      },
      {
        "code": "14380",
        "name": "Xã Tam Ngãi",
        "type": "xa"
      },
      {
        "code": "12076",
        "name": "Xã Tân An",
        "type": "xa"
      },
      {
        "code": "28972",
        "name": "Xã Tân Hào",
        "type": "xa"
      },
      {
        "code": "14892",
        "name": "Xã Tân Hòa",
        "type": "xa"
      },
      {
        "code": "3372",
        "name": "Xã Tân Long Hội",
        "type": "xa"
      },
      {
        "code": "9772",
        "name": "Xã Tân Lược",
        "type": "xa"
      },
      {
        "code": "21804",
        "name": "Xã Tân Phú",
        "type": "xa"
      },
      {
        "code": "9516",
        "name": "Xã Tân Quới",
        "type": "xa"
      },
      {
        "code": "23340",
        "name": "Xã Tân Thành Bình",
        "type": "xa"
      },
      {
        "code": "26668",
        "name": "Xã Tân Thủy",
        "type": "xa"
      },
      {
        "code": "27436",
        "name": "Xã Tân Xuân",
        "type": "xa"
      },
      {
        "code": "15404",
        "name": "Xã Tập Ngãi",
        "type": "xa"
      },
      {
        "code": "18220",
        "name": "Xã Tập Sơn",
        "type": "xa"
      },
      {
        "code": "26156",
        "name": "Xã Thạnh Hải",
        "type": "xa"
      },
      {
        "code": "26412",
        "name": "Xã Thạnh Phong",
        "type": "xa"
      },
      {
        "code": "25644",
        "name": "Xã Thạnh Phú",
        "type": "xa"
      },
      {
        "code": "30508",
        "name": "Xã Thạnh Phước",
        "type": "xa"
      },
      {
        "code": "24364",
        "name": "Xã Thành Thới",
        "type": "xa"
      },
      {
        "code": "31020",
        "name": "Xã Thạnh Trị",
        "type": "xa"
      },
      {
        "code": "30252",
        "name": "Xã Thới Thuận",
        "type": "xa"
      },
      {
        "code": "21548",
        "name": "Xã Tiên Thủy",
        "type": "xa"
      },
      {
        "code": "14636",
        "name": "Xã Tiểu Cần",
        "type": "xa"
      },
      {
        "code": "2860",
        "name": "Xã Trà Côn",
        "type": "xa"
      },
      {
        "code": "16940",
        "name": "Xã Trà Cú",
        "type": "xa"
      },
      {
        "code": "2604",
        "name": "Xã Trà Ôn",
        "type": "xa"
      },
      {
        "code": "7212",
        "name": "Xã Trung Hiệp",
        "type": "xa"
      },
      {
        "code": "6700",
        "name": "Xã Trung Ngãi",
        "type": "xa"
      },
      {
        "code": "6444",
        "name": "Xã Trung Thành",
        "type": "xa"
      },
      {
        "code": "16172",
        "name": "Xã Vinh Kim",
        "type": "xa"
      },
      {
        "code": "22572",
        "name": "Xã Vĩnh Thành",
        "type": "xa"
      },
      {
        "code": "8236",
        "name": "Xã Vĩnh Xuân",
        "type": "xa"
      }
    ]
  }
] as const;
