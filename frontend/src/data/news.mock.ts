export type NewsSection = {
    heading: string;
    body: string;
};

export type NewsItem = {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    cover: string;
    category: string;
    author: string;
    comments: number;
    created_at: string;
    quote?: string;
    sections?: NewsSection[];
    tips?: string[];
};

export const NEWS_MOCK: NewsItem[] = [
    {
        id: "1",
        slug: "quy-trinh-che-tac-trang-suc-bac",
        title: "Quy trình chế tác trang sức bạc gồm những giai đoạn nào?",
        excerpt:
            "Khám phá các công đoạn tạo nên một món trang sức bạc tinh tế, từ ý tưởng, tạo hình đến hoàn thiện chi tiết.",
        content: `
Quy trình chế tác trang sức bạc thường bắt đầu từ ý tưởng thiết kế, lựa chọn chất liệu, tạo mẫu và hoàn thiện bề mặt.

Mỗi công đoạn đều cần sự tỉ mỉ để sản phẩm cuối cùng vừa đẹp, vừa có độ bền tốt khi sử dụng hằng ngày.
    `,
        cover: "/news/news1.jpg",
        category: "Kiến thức",
        author: "Blue Peach",
        comments: 0,
        created_at: "2026-04-22",
    },
    {
        id: "2",
        slug: "deo-nhan-nhieu-ngon",
        title: "Đeo nhẫn nhiều ngón: Hướng dẫn cách phối nhẫn thật sành điệu",
        excerpt:
            "Một vài nguyên tắc nhỏ giúp bạn phối nhiều chiếc nhẫn mà vẫn tinh tế, hài hòa và không bị rối mắt.",
        content: `
Đeo nhiều nhẫn cùng lúc là cách thể hiện phong cách cá nhân rất rõ nét. Bạn nên chọn nhẫn có cùng tone chất liệu hoặc cùng tinh thần thiết kế.

Nếu mới bắt đầu, hãy phối 2–3 chiếc nhẫn mảnh trước khi thử các layout cầu kỳ hơn.
    `,
        cover: "/news/news2.jpg",
        category: "Phong cách",
        author: "Blue Peach",
        comments: 0,
        created_at: "2026-04-22",
    },
    {
        id: "3",
        slug: "xu-huong-big-metal",
        title: "Xu hướng Big Metal: Sành điệu cùng trang sức bạc bản to",
        excerpt:
            "Trang sức bạc bản to đang trở lại như một điểm nhấn mạnh mẽ cho outfit tối giản và hiện đại.",
        content: `
Big Metal là xu hướng dành cho những ai muốn tạo điểm nhấn rõ ràng hơn với trang sức.

Bạn có thể bắt đầu bằng khuyên tai bản lớn, vòng cổ chain hoặc nhẫn bạc có form nổi bật.
    `,
        cover: "/news/news3.jpg",
        category: "Xu hướng",
        author: "Blue Peach",
        comments: 0,
        created_at: "2026-04-22",
    },
    {
        id: "4",
        slug: "cach-chon-day-chuyen-phu-hop",
        title: "Cách chọn dây chuyền phù hợp với phong cách hằng ngày",
        excerpt:
            "Gợi ý chọn dây chuyền bạc theo dáng cổ, trang phục và phong cách cá nhân.",
        content: `
Dây chuyền bạc là món trang sức dễ phối và có thể tạo điểm nhấn rất tinh tế.

Với phong cách tối giản, những thiết kế mảnh, nhẹ và có chi tiết nhỏ sẽ dễ đồng hành hơn trong nhiều hoàn cảnh.
    `,
        cover: "/news/news4.jpg",
        category: "Gợi ý phối đồ",
        author: "Blue Peach",
        comments: 0,
        created_at: "2026-04-20",
        quote: "Một món trang sức đẹp không chỉ nằm ở độ lấp lánh, mà còn ở cách nó đồng hành cùng phong cách của người đeo.",
        sections: [
            {
                heading: "1. Bắt đầu từ phong cách cá nhân",
                body: "Trước khi chọn trang sức, bạn nên xác định phong cách thường ngày của mình. Nếu yêu thích sự tối giản, những thiết kế bạc mảnh, nhẹ và ít chi tiết sẽ dễ phối hơn. Nếu muốn tạo điểm nhấn, bạn có thể chọn mặt dây, nhẫn hoặc khuyên tai có hình khối nổi bật hơn.",
            },
            {
                heading: "2. Ưu tiên sự cân bằng",
                body: "Trang sức nên bổ trợ cho tổng thể trang phục thay vì lấn át hoàn toàn. Với áo cổ tròn hoặc cổ vuông, dây chuyền ngắn sẽ giúp phần cổ sáng hơn. Với áo sơ mi hoặc blazer, dây chuyền mảnh hoặc khuyên tai nhỏ sẽ tạo cảm giác tinh tế và chỉn chu.",
            },
            {
                heading: "3. Chọn thiết kế dễ dùng lâu dài",
                body: "Một món trang sức bạc tốt nên có tính ứng dụng cao. Những thiết kế có đường nét mềm, màu bạc sáng và chi tiết vừa đủ thường dễ đồng hành trong nhiều hoàn cảnh: đi học, đi làm, đi chơi hoặc làm quà tặng.",
            },
        ],
        tips: [
            "Không nên phối quá nhiều món nổi bật cùng lúc.",
            "Nên lau trang sức sau khi đeo để giữ độ sáng.",
            "Nếu mua làm quà, hãy chọn thiết kế tối giản để dễ hợp phong cách người nhận.",
        ],
    },
    {
        id: "5",
        slug: "trang-suc-bac-co-bi-den-khong",
        title: "Trang sức bạc có bị đen không?",
        excerpt:
            "Giải thích nguyên nhân bạc bị xỉn màu và cách chăm sóc để trang sức luôn sáng đẹp.",
        content: `
Trang sức bạc có thể bị xỉn màu theo thời gian do tiếp xúc với mồ hôi, mỹ phẩm, nước hoa hoặc môi trường ẩm.

Bạn có thể hạn chế bằng cách lau sạch sau khi đeo, bảo quản trong túi kín và tránh tiếp xúc trực tiếp với hóa chất.
    `,
        cover: "/news/news5.jpg",
        category: "Chăm sóc trang sức",
        author: "Blue Peach",
        comments: 0,
        created_at: "2026-04-18",
    },
    {
        id: "6",
        slug: "goi-y-qua-tang-ban-gai-duoi-500k",
        title: "Gợi ý quà tặng bạn gái dưới 500k",
        excerpt:
            "Những món trang sức bạc nhỏ xinh, tinh tế và dễ tạo thiện cảm trong các dịp đặc biệt.",
        content: `
Một món quà không cần quá cầu kỳ để trở nên đáng nhớ.

Với ngân sách dưới 500k, bạn có thể chọn khuyên tai bạc, dây chuyền mảnh hoặc lắc tay tối giản.
    `,
        cover: "/news/news6.jpg",
        category: "Quà tặng",
        author: "Blue Peach",
        comments: 0,
        created_at: "2026-04-16",
    },
];