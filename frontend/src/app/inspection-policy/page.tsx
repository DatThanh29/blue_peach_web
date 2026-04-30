import FooterContentPage from "@/components/footer/FooterContentPage";

export default function InspectionPolicyPage() {
  return (
    <FooterContentPage
      eyebrow="Hỗ trợ"
      title="Chính sách kiểm hàng"
      description="Blue Peach khuyến khích khách hàng kiểm tra sản phẩm khi nhận hàng để đảm bảo đơn hàng đúng thông tin và tình trạng sản phẩm đạt yêu cầu."
      sections={[
        {
          title: "Nội dung kiểm hàng",
          bullets: [
            "Kiểm tra đúng tên sản phẩm, số lượng và mẫu mã theo đơn đặt hàng.",
            "Kiểm tra tình trạng đóng gói và ngoại quan sản phẩm tại thời điểm nhận hàng.",
            "Đối chiếu sản phẩm thực tế với thông tin đơn hàng nếu cần.",
          ],
        },
        {
          title: "Lưu ý khi nhận hàng",
          bullets: [
            "Quý khách nên kiểm tra sản phẩm ngay khi đơn hàng được giao đến.",
            "Nếu phát hiện sản phẩm sai hoặc có dấu hiệu bất thường, vui lòng liên hệ Blue Peach sớm nhất để được hỗ trợ.",
            "Việc kiểm hàng nên được thực hiện cẩn thận để đảm bảo quyền lợi của khách hàng.",
          ],
        },
        {
          title: "Hỗ trợ sau kiểm hàng",
          bullets: [
            "Blue Peach sẽ tiếp nhận và xử lý các phản hồi liên quan đến sai sót đơn hàng một cách rõ ràng và nhanh chóng.",
            "Trong các trường hợp cần thiết, khách hàng có thể được hướng dẫn đổi trả theo chính sách hiện hành.",
          ],
        },
      ]}
      closingTitle="Nhận hàng an tâm hơn cùng Blue Peach"
      closingText="Việc kiểm hàng giúp bạn yên tâm hơn khi mua sắm và cũng giúp Blue Peach hỗ trợ nhanh hơn trong trường hợp phát sinh vấn đề cần xử lý."
      highlights={[
        "✔ Khuyến khích kiểm tra ngay khi nhận hàng.",
        "✔ Hỗ trợ xử lý khi phát hiện sai sót đơn hàng.",
        "✔ Chính sách rõ ràng, dễ thực hiện và minh bạch.",
      ]}
      primaryCta={{ href: "/contact", label: "Liên hệ hỗ trợ" }}
      secondaryCta={{ href: "/returns", label: "Xem chính sách đổi trả" }}
    />
  );
}