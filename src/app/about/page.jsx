import Image from 'next/image';
import { FaCheck } from 'react-icons/fa';

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Về Chúng Tôi</h1>
            <p className="text-gray-600 mb-8">Câu chuyện về Tuấn Rèm và những giá trị chúng tôi mang lại</p>

            {/* Our Story Section */}
            <section className="mb-16">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-1/2">
                            <div className="relative h-80 md:h-full">
                                <Image
                                    src="/images/about-store.jpg"
                                    alt="Cửa hàng rèm cửa"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        </div>

                        <div className="md:w-1/2 p-8">
                            <h2 className="text-2xl font-bold mb-4">Câu Chuyện Của Chúng Tôi</h2>
                            <p className="text-gray-600 mb-4">
                                Chúng tôi là Tuấn Rèm – một cơ sở nhỏ đã làm nghề hơn 20 năm. Nhờ sự tin tưởng của khách hàng, chúng tôi có cơ hội gắn bó với công việc lắp rèm cho nhiều gia đình, cửa hàng và văn phòng.
                            </p>
                            <p className="text-gray-600">
                                Chúng tôi cố gắng chọn những mẫu rèm đơn giản, bền đẹp, và phù hợp với từng không gian.
                                Thanh phụ kiện thì có đủ loại để lắp cho các khung cửa khác nhau. Làm xong công trình nào, chúng tôi cũng cố gắng làm cẩn thận, đo đạc kỹ từng chút một.
                                Nếu có dịp hợp tác, chúng tôi rất mong được phục vụ chu đáo, và luôn sẵn sàng hỗ trợ trong suốt thời gian bảo hành.
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
                        <div
                            className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4 mx-auto">
                            <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-center">Chất Lượng</h3>
                        <p className="text-gray-600 text-center">
                            Chúng tôi chọn vật liệu tốt, làm theo cách chắc chắn và kỹ lưỡng, mong sao sản phẩm dùng được lâu, an toàn và không ảnh hưởng đến môi trường.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div
                            className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4 mx-auto">
                            <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-center">Dịch Vụ Khách Hàng</h3>
                        <p className="text-gray-600 text-center">
                            Chúng tôi luôn cố gắng nghĩ cho khách trước. Từ lúc tư vấn, chọn mẫu cho đến khi lắp đặt xong, rồi cả sau đó nữa – lúc nào cũng mong khách hài lòng và yên tâm.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div
                            className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4 mx-auto">
                            <svg className="w-8 h-8 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd"
                                    d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
                                    clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-center">Sáng Tạo</h3>
                        <p className="text-gray-600 text-center">
                            Chúng tôi vẫn luôn học hỏi thêm, tìm hiểu những mẫu mã mới và cách làm tốt hơn, để sản phẩm ngày càng phù hợp hơn với nhu cầu và gu thẩm mỹ của khách hàng.
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
                                            rèm cầu vồng
                                            với nhiều mẫu mã, chất liệu và màu sắc.
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start">
                                    <FaCheck className="text-green-500 mt-1 mr-3" />
                                    <div>
                                        <h3 className="font-semibold">Tư vấn chuyên nghiệp</h3>
                                        <p className="text-gray-600">
                                            Đội ngũ tư vấn giàu kinh nghiệm sẽ giúp bạn chọn lựa sản phẩm phù hợp nhất
                                            với
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
                                            Đội ngũ kỹ thuật viên lành nghề sẽ đảm bảo sản phẩm được lắp đặt chính xác,
                                            an toàn và thẩm mỹ.
                                        </p>
                                    </div>
                                </li>

                                <li className="flex items-start">
                                    <FaCheck className="text-green-500 mt-1 mr-3" />
                                    <div>
                                        <h3 className="font-semibold">Bảo hành dài hạn</h3>
                                        <p className="text-gray-600">
                                            Chúng tôi cung cấp dịch vụ bảo hành cho tất cả sản phẩm, đảm bảo bạn hoàn
                                            toàn
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