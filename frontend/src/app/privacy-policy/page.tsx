import FooterContentPage from "@/components/footer/FooterContentPage";

export default function PrivacyPolicyPage() {
  return (
    <FooterContentPage
      eyebrow="Hỗ trợ"
      title="Chính sách bảo mật"
      description="Blue Peach tôn trọng quyền riêng tư của khách hàng và cam kết bảo vệ thông tin cá nhân trong suốt quá trình truy cập, mua sắm và sử dụng dịch vụ."
      sections={[
        {
          title: "Thông tin được thu thập",
          bullets: [
            "Thông tin cá nhân cơ bản như họ tên, số điện thoại, email và địa chỉ nhận hàng.",
            "Thông tin đơn hàng, lịch sử mua sắm và tương tác hỗ trợ khách hàng.",
            "Một số dữ liệu kỹ thuật cần thiết để tối ưu trải nghiệm sử dụng website.",
          ],
        },
        {
          title: "Mục đích sử dụng",
          bullets: [
            "Xử lý đơn hàng, giao hàng và hỗ trợ sau bán.",
            "Cải thiện chất lượng dịch vụ và trải nghiệm trên website.",
            "Liên hệ khi cần xác nhận thông tin hoặc hỗ trợ khách hàng.",
          ],
        },
        {
          title: "Cam kết bảo mật",
          bullets: [
            "Blue Peach không chia sẻ thông tin cá nhân của khách hàng cho bên thứ ba ngoài phạm vi cần thiết để vận hành đơn hàng và dịch vụ.",
            "Thông tin khách hàng được quản lý cẩn thận và sử dụng đúng mục đích.",
            "Khách hàng có thể liên hệ với Blue Peach nếu cần cập nhật hoặc điều chỉnh thông tin cá nhân.",
          ],
        },
      ]}
      closingTitle="Bảo vệ thông tin là một phần của trải nghiệm tin cậy"
      closingText="Blue Peach hiểu rằng sự an tâm của khách hàng bắt đầu từ việc thông tin cá nhân được sử dụng minh bạch, đúng mục đích và có trách nhiệm."
      highlights={[
        "✔ Thu thập thông tin ở mức cần thiết.",
        "✔ Sử dụng thông tin đúng mục đích vận hành và chăm sóc khách hàng.",
        "✔ Luôn hướng đến trải nghiệm mua sắm an toàn và đáng tin cậy.",
      ]}
      primaryCta={{ href: "/contact", label: "Liên hệ Blue Peach" }}
      secondaryCta={{ href: "/about", label: "Tìm hiểu thương hiệu" }}
    />
  );
}