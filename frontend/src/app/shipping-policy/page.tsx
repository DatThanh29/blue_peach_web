import FooterContentPage from "@/components/footer/FooterContentPage";

export default function ShippingPolicyPage() {
  return (
    <FooterContentPage
      eyebrow="Hỗ trợ"
      title="Chính sách vận chuyển"
      description="Blue Peach hợp tác cùng các đơn vị giao hàng phù hợp để đơn hàng được vận chuyển an toàn, đúng thông tin và tối ưu thời gian giao nhận."
      sections={[
        {
          title: "Phạm vi áp dụng",
          bullets: [
            "Áp dụng cho các đơn hàng được đặt thành công trên website Blue Peach.",
            "Hỗ trợ giao hàng theo địa chỉ khách hàng cung cấp trong quá trình đặt hàng.",
          ],
        },
        {
          title: "Thời gian giao hàng",
          bullets: [
            "Thời gian giao hàng có thể thay đổi tùy theo khu vực nhận hàng, thời điểm đặt hàng và đơn vị vận chuyển.",
            "Các dịp cao điểm, ngày lễ hoặc điều kiện khách quan có thể ảnh hưởng đến thời gian giao nhận thực tế.",
          ],
        },
        {
          title: "Lưu ý vận chuyển",
          bullets: [
            "Khách hàng cần cung cấp thông tin nhận hàng chính xác để quá trình giao hàng thuận lợi hơn.",
            "Blue Peach sẽ hỗ trợ kiểm tra tình trạng đơn hàng nếu phát sinh chậm trễ hoặc vấn đề trong quá trình vận chuyển.",
            "Phí vận chuyển, nếu có, sẽ được hiển thị rõ trong quá trình thanh toán.",
          ],
        },
      ]}
      closingTitle="Đơn hàng được giao đi với sự chỉn chu"
      closingText="Blue Peach luôn cố gắng để từng đơn hàng được chuẩn bị cẩn thận và giao đến bạn trong trạng thái an toàn, chỉn chu và đúng trải nghiệm mà thương hiệu mong muốn."
      highlights={[
        "✔ Giao hàng theo thông tin khách cung cấp.",
        "✔ Thời gian giao nhận minh bạch theo từng khu vực.",
        "✔ Hỗ trợ theo dõi đơn hàng khi cần thiết.",
      ]}
      primaryCta={{ href: "/contact", label: "Liên hệ về đơn hàng" }}
      secondaryCta={{ href: "/products", label: "Tiếp tục mua sắm" }}
    />
  );
}