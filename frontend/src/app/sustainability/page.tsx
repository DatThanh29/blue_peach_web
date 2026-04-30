import FooterContentPage from "@/components/footer/FooterContentPage";

export default function SustainabilityPage() {
  return (
    <FooterContentPage
      eyebrow="Giới thiệu"
      title="Blue Peach và định hướng bền vững"
      description="Blue Peach tin rằng vẻ đẹp bền lâu không chỉ đến từ thiết kế, mà còn đến từ cách thương hiệu lựa chọn chất liệu, quy trình và trách nhiệm trong từng quyết định."
      sections={[
        {
          title: "Tư duy phát triển bền vững",
          paragraphs: [
            "Chúng tôi theo đuổi những giá trị có thể đồng hành lâu dài cùng khách hàng: thiết kế dễ ứng dụng, chất liệu phù hợp và trải nghiệm mua sắm đáng tin cậy.",
          ],
        },
        {
          title: "Những điều Blue Peach hướng đến",
          bullets: [
            "Ưu tiên những thiết kế có tính ứng dụng lâu dài thay vì chạy theo xu hướng quá ngắn hạn.",
            "Chú trọng độ bền và giá trị sử dụng của sản phẩm trong thực tế.",
            "Tối ưu quy trình vận hành và hoàn thiện sản phẩm theo hướng cẩn thận, hạn chế lãng phí không cần thiết.",
          ],
        },
        {
          title: "Cam kết của thương hiệu",
          bullets: [
            "Liên tục cải thiện trải nghiệm mua sắm theo hướng minh bạch và có trách nhiệm hơn.",
            "Đề cao giá trị sử dụng lâu dài của mỗi món trang sức.",
            "Xây dựng thương hiệu với tư duy tinh gọn, bền vững và tôn trọng khách hàng.",
          ],
        },
      ]}
      closingTitle="Sự bền vững bắt đầu từ những lựa chọn nhỏ nhưng nhất quán"
      closingText="Blue Peach hiểu rằng hành trình bền vững là một quá trình dài. Vì vậy, chúng tôi chọn bắt đầu từ những điều thực tế nhất: sản phẩm chỉn chu, trải nghiệm đáng tin và những giá trị có thể đồng hành lâu hơn với khách hàng."
      highlights={[
        "✔ Thiết kế hướng đến giá trị sử dụng lâu dài.",
        "✔ Quy trình vận hành tinh gọn và có trách nhiệm hơn.",
        "✔ Tôn trọng trải nghiệm bền vững từ sản phẩm đến dịch vụ.",
      ]}
      primaryCta={{ href: "/about", label: "Tìm hiểu Blue Peach" }}
      secondaryCta={{ href: "/collections", label: "Khám phá bộ sưu tập" }}
    />
  );
}