import StructuredData, { createAboutPageSchema } from '@/components/StructureData';
import Image from 'next/image';
import { FaCheck, FaMedal, FaUsers, FaLightbulb } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <StructuredData
        data={createAboutPageSchema({
          title: 'Giới thiệu Tuấn Rèm',
          description: 'Tuấn Rèm là đơn vị chuyên lắp đặt rèm cửa uy tín và chất lượng tại Việt Nam.',
        })}
      />

      <h1 className="text-3xl font-bold mb-2">Về Chúng Tôi</h1>
      <p className="text-gray-600 mb-8">
        Câu chuyện về Tuấn Rèm và những giá trị chúng tôi mang lại
      </p>

      {/* Our Story Section */}
      <section className="mb-16">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="relative h-80 md:h-full">
                <Image
                  src="/images/logo-2.png"
                  alt="Cửa hàng rèm cửa"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>

            <div className="md:w-1/2 p-8">
              <h2 className="text-2xl font-bold mb-4">Câu Chuyện Của Chúng Tôi</h2>
              <p className="text-gray-600 mb-4">
                Tuấn Rèm là một cơ sở chuyên về rèm cửa với hơn 10 năm kinh nghiệm trong nghề. Chúng
                tôi luôn đặt uy tín và chất lượng lên hàng đầu, mong muốn mang đến cho khách hàng
                những sản phẩm phù hợp, bền đẹp và tinh tế.
              </p>
              <p className="text-gray-600">
                Với mẫu mã đa dạng và đầy đủ thanh phụ kiện cao cấp cho nhiều loại khung cửa khác
                nhau, Tuấn Rèm đáp ứng được nhu cầu của nhiều không gian – từ nhà ở, căn hộ cho đến
                văn phòng và cửa hàng. Chúng tôi chú trọng từng chi tiết trong thi công, đảm bảo lắp
                đặt nhanh gọn, chuẩn xác, và đi kèm với đó là chế độ bảo hành 12 tháng để khách hàng
                yên tâm sử dụng. Với Tuấn Rèm, mỗi bộ rèm không chỉ là sản phẩm, mà còn là sự chăm
                chút cho không gian sống của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Giá Trị Cốt Lõi</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
              <FaMedal className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Chất Lượng</h3>
            <p className="text-gray-600 text-center">
              Chúng tôi cam kết sử dụng những nguyên vật liệu tốt nhất và quy trình sản xuất tiên
              tiến để tạo ra các sản phẩm bền đẹp, an toàn và thân thiện với môi trường.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 mx-auto">
              <FaUsers className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Dịch Vụ Khách Hàng</h3>
            <p className="text-gray-600 text-center">
              Chúng tôi đặt khách hàng vào trung tâm của mọi hoạt động. Từ tư vấn chọn lựa đến lắp
              đặt và hậu mãi, chúng tôi luôn nỗ lực mang đến trải nghiệm tốt nhất cho khách hàng.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4 mx-auto">
              <FaLightbulb className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">Sáng Tạo</h3>
            <p className="text-gray-600 text-center">
              Chúng tôi không ngừng đổi mới, cập nhật xu hướng và công nghệ mới nhất để mang đến
              những sản phẩm độc đáo, thẩm mỹ và đáp ứng nhu cầu ngày càng cao của khách hàng.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="mb-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Tại Sao Chọn Chúng Tôi?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold">Đa dạng sản phẩm</h3>
                    <p className="text-gray-600">
                      Chúng tôi cung cấp đầy đủ các loại rèm cửa từ rèm vải, rèm cuốn, rèm sáo đến
                      rèm cầu vồng với nhiều mẫu mã, chất liệu và màu sắc.
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold">Tư vấn chuyên nghiệp</h3>
                    <p className="text-gray-600">
                      Đội ngũ tư vấn giàu kinh nghiệm sẽ giúp bạn chọn lựa sản phẩm phù hợp nhất với
                      không gian và ngân sách.
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold">Sản xuất theo yêu cầu</h3>
                    <p className="text-gray-600">
                      Chúng tôi có thể sản xuất rèm cửa theo kích thước và thiết kế riêng của bạn.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold">Lắp đặt chuyên nghiệp</h3>
                    <p className="text-gray-600">
                      Đội ngũ kỹ thuật viên lành nghề sẽ đảm bảo sản phẩm được lắp đặt chính xác, an
                      toàn và thẩm mỹ.
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold">Bảo hành dài hạn</h3>
                    <p className="text-gray-600">
                      Chúng tôi cung cấp dịch vụ bảo hành cho tất cả sản phẩm, đảm bảo bạn hoàn toàn
                      hài lòng với trải nghiệm mua sắm.
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <FaCheck className="text-green-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold">Giá cả cạnh tranh</h3>
                    <p className="text-gray-600">
                      Chúng tôi cam kết mang đến sản phẩm chất lượng với mức giá hợp lý nhất trên
                      thị trường.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section>
                <h2 className="text-2xl font-bold mb-6 text-center">Đội Ngũ Của Chúng Tôi</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="relative h-64">
                            <Image
                                src="/images/team-1.jpg"
                                alt="CEO"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className="p-4 text-center">
                            <h3 className="font-semibold text-lg">Nguyễn Văn A</h3>
                            <p className="text-indigo-600">Giám Đốc</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="relative h-64">
                            <Image
                                src="/images/team-2.jpg"
                                alt="Design Manager"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className="p-4 text-center">
                            <h3 className="font-semibold text-lg">Trần Thị B</h3>
                            <p className="text-indigo-600">Quản Lý Thiết Kế</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="relative h-64">
                            <Image
                                src="/images/team-3.jpg"
                                alt="Sales Manager"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className="p-4 text-center">
                            <h3 className="font-semibold text-lg">Lê Văn C</h3>
                            <p className="text-indigo-600">Quản Lý Kinh Doanh</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="relative h-64">
                            <Image
                                src="/images/team-4.jpg"
                                alt="Customer Service"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <div className="p-4 text-center">
                            <h3 className="font-semibold text-lg">Phạm Thị D</h3>
                            <p className="text-indigo-600">Chăm Sóc Khách Hàng</p>
                        </div>
                    </div>
                </div>
            </section> */}
    </div>
  );
}
