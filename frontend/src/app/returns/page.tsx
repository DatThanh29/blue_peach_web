import FooterContentPage from "@/components/footer/FooterContentPage";

export default function ReturnsPage() {
  return (
    <FooterContentPage
      eyebrow="Hỗ trợ"
      title="Chính sách đổi và trả hàng"
      description="Blue Peach mong muốn bạn luôn hài lòng với sản phẩm đã chọn. Chính sách đổi và trả hàng được xây dựng rõ ràng để giúp trải nghiệm mua sắm trở nên an tâm và thuận tiện hơn."
      sections={[
        {
          title: "Điều kiện áp dụng",
          bullets: [
            "Sản phẩm còn nguyên trạng, chưa qua sử dụng và không bị hư hại do tác động từ phía khách hàng.",
            "Yêu cầu đổi trả được gửi trong thời gian quy định kể từ ngày nhận hàng.",
            "Sản phẩm còn đầy đủ hộp, phụ kiện, quà tặng kèm và hóa đơn nếu có.",
          ],
        },
        {
          title: "Các trường hợp hỗ trợ",
          bullets: [
            "Sản phẩm bị lỗi sản xuất hoặc lỗi hoàn thiện từ Blue Peach.",
            "Sản phẩm giao sai mẫu, sai số lượng hoặc sai thông tin đơn hàng.",
            "Khách hàng có nhu cầu đổi sang sản phẩm khác phù hợp hơn theo chính sách hiện hành.",
          ],
        },
        {
          title: "Lưu ý",
          bullets: [
            "Các sản phẩm có dấu hiệu đã qua sử dụng hoặc bị tác động từ bên ngoài có thể không đủ điều kiện đổi trả.",
            "Chi phí vận chuyển phát sinh sẽ được áp dụng tùy từng trường hợp cụ thể.",
            "Blue Peach có quyền từ chối hỗ trợ nếu yêu cầu không đáp ứng điều kiện chính sách.",
          ],
        },
      ]}
      closingTitle="Hỗ trợ minh bạch và dễ hiểu"
      closingText="Nếu bạn cần hỗ trợ đổi hoặc trả hàng, hãy liên hệ Blue Peach sớm nhất để đội ngũ của chúng tôi hướng dẫn chi tiết và đồng hành cùng bạn."
      highlights={[
        "✔ Chính sách rõ ràng, dễ theo dõi.",
        "✔ Hỗ trợ nhanh với các trường hợp lỗi từ nhà bán.",
        "✔ Ưu tiên trải nghiệm mua sắm an tâm cho khách hàng.",
      ]}
      primaryCta={{ href: "/contact", label: "Liên hệ hỗ trợ" }}
      secondaryCta={{ href: "/products", label: "Tiếp tục mua sắm" }}
    />
  );
}