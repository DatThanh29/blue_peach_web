import FooterContentPage from "@/components/footer/FooterContentPage";

export default function PaymentPolicyPage() {
  return (
    <FooterContentPage
      eyebrow="Hỗ trợ"
      title="Chính sách thanh toán"
      description="Blue Peach cung cấp các hình thức thanh toán phù hợp để quá trình mua sắm diễn ra thuận tiện, minh bạch và dễ theo dõi."
      sections={[
        {
          title: "Hình thức thanh toán",
          bullets: [
            "Thanh toán khi nhận hàng (COD) đối với các đơn hàng đủ điều kiện áp dụng.",
            "Thanh toán trực tuyến qua cổng thanh toán được tích hợp trên website.",
          ],
        },
        {
          title: "Xác nhận thanh toán",
          bullets: [
            "Đơn hàng chỉ được ghi nhận khi khách hàng hoàn tất thông tin cần thiết trong quá trình đặt hàng.",
            "Với các hình thức thanh toán trực tuyến, trạng thái thanh toán sẽ được cập nhật theo kết quả giao dịch thực tế.",
          ],
        },
        {
          title: "Lưu ý",
          bullets: [
            "Khách hàng vui lòng kiểm tra kỹ thông tin đơn hàng trước khi xác nhận thanh toán.",
            "Trong trường hợp phát sinh lỗi thanh toán hoặc gián đoạn giao dịch, hãy liên hệ Blue Peach để được hỗ trợ sớm nhất.",
            "Blue Peach có thể điều chỉnh hình thức thanh toán áp dụng tùy theo từng thời điểm vận hành.",
          ],
        },
      ]}
      closingTitle="Thanh toán thuận tiện, trải nghiệm mua sắm liền mạch"
      closingText="Chúng tôi hướng đến quy trình thanh toán rõ ràng và dễ sử dụng để khách hàng có thể hoàn tất đơn hàng một cách thoải mái, an tâm và nhanh chóng."
      highlights={[
        "✔ Hỗ trợ COD và thanh toán trực tuyến.",
        "✔ Trạng thái thanh toán rõ ràng theo từng đơn hàng.",
        "✔ Dễ liên hệ hỗ trợ nếu phát sinh lỗi giao dịch.",
      ]}
      primaryCta={{ href: "/contact", label: "Cần hỗ trợ thanh toán" }}
      secondaryCta={{ href: "/products", label: "Xem sản phẩm" }}
    />
  );
}