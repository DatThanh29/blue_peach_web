import FooterContentPage from "@/components/footer/FooterContentPage";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";

export default function AboutPage() {
  return (
    <>
      <PageBreadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Giới thiệu", active: true },
        ]}
      />

      <FooterContentPage
        eyebrow="Giới thiệu"
        title="Blue Peach — Trang sức bạc tinh tế cho những khoảnh khắc được nâng niu."
        description="Blue Peach ra đời với mong muốn mang đến những thiết kế trang sức bạc tối giản, nữ tính và thanh lịch — nơi vẻ đẹp không chỉ nằm ở ánh nhìn đầu tiên, mà còn ở cảm giác được đồng hành lâu dài cùng người đeo."
        sections={[
          {
            title: "Sứ mệnh",
            paragraphs: [
              "Blue Peach được xây dựng để tạo nên những món trang sức có thể đi cùng bạn qua nhiều khoảnh khắc khác nhau của cuộc sống — từ thường ngày đến những dịp đáng nhớ.",
            ],
            bullets: [
              "Mang đến trang sức bạc chất lượng cao, được hoàn thiện chỉn chu từ chất liệu đến chi tiết cuối cùng.",
              "Tôn vinh sự tự tin, nét nữ tính và phong cách riêng của người phụ nữ hiện đại.",
              "Biến mỗi món trang sức thành một dấu ấn nhỏ nhưng bền bỉ trong hành trình làm đẹp và lưu giữ kỷ niệm.",
            ],
          },
          {
            title: "Giá trị cốt lõi",
            bullets: [
              "Tinh tế đến từng chi tiết: Mỗi thiết kế đều được chăm chút kỹ lưỡng để mang lại cảm giác thanh lịch, nhẹ nhàng nhưng vẫn nổi bật vừa đủ.",
              "Cam kết chất lượng: Blue Peach ưu tiên chất liệu bạc 925 và quy trình hoàn thiện cẩn thận để sản phẩm bền đẹp theo thời gian.",
              "Trách nhiệm với khách hàng: Chúng tôi luôn hướng đến trải nghiệm mua sắm minh bạch, tận tâm và dễ dàng tin tưởng.",
              "Hướng đến sự bền vững: Blue Peach đề cao các lựa chọn thiết kế và vận hành có trách nhiệm hơn với môi trường và giá trị sử dụng lâu dài.",
            ],
          },
          {
            title: "Sản phẩm Blue Peach — Vẻ đẹp đến từ sự chỉn chu",
            paragraphs: [
              "Không chỉ là phụ kiện, mỗi sản phẩm của Blue Peach là sự kết hợp giữa cảm hứng thẩm mỹ, khả năng ứng dụng và độ hoàn thiện trong từng chi tiết nhỏ.",
            ],
            bullets: [
              "Thiết kế mang tinh thần tối giản và hiện đại, dễ phối cùng nhiều phong cách khác nhau.",
              "Chất liệu bạc 925 được lựa chọn để vừa giữ được vẻ thanh thoát, vừa phù hợp cho nhu cầu đeo thường ngày.",
              "Mỗi sản phẩm đều được kiểm tra cẩn thận trước khi đến tay khách hàng để đảm bảo tính thẩm mỹ và độ an tâm khi sử dụng.",
            ],
          },
          {
            title: "Đội ngũ Blue Peach",
            paragraphs: [
              "Đằng sau Blue Peach là một tập thể yêu cái đẹp, trân trọng sự bền vững và tin rằng trang sức nên mang lại cảm giác tự tin thật tự nhiên cho người đeo.",
            ],
            bullets: [
              "Nhóm thiết kế không ngừng tìm kiếm sự cân bằng giữa nét mềm mại, hiện đại và khả năng ứng dụng cao.",
              "Đội ngũ vận hành và hoàn thiện sản phẩm luôn đặt sự chỉn chu và ổn định chất lượng lên hàng đầu.",
              "Bộ phận chăm sóc khách hàng đồng hành cùng bạn bằng sự lắng nghe, rõ ràng và tận tâm trong từng trải nghiệm.",
            ],
          },
        ]}
        closingTitle="Blue Peach — Nơi vẻ đẹp được giữ lại bằng sự tinh tế"
        closingText="Chúng tôi không chỉ gửi đến bạn một món trang sức, mà còn mong muốn trao đi cảm giác được nâng niu, được tự tin và được thể hiện đúng cá tính của mình. Mỗi thiết kế của Blue Peach là một lời nhắc nhẹ nhàng rằng vẻ đẹp bền lâu luôn bắt đầu từ sự tinh tế."
        highlights={[
          "✔ Bạc 925 thanh lịch, phù hợp cho phong cách đeo hằng ngày.",
          "✔ Thiết kế nữ tính, tối giản và dễ phối cùng nhiều trang phục.",
          "✔ Chính sách hỗ trợ rõ ràng, minh bạch và đồng hành lâu dài với khách hàng.",
        ]}
        primaryCta={{
          href: "/collections",
          label: "Khám phá bộ sưu tập",
        }}
        secondaryCta={{
          href: "/products",
          label: "Xem tất cả sản phẩm",
        }}
      />
    </>
  );
}
