export type Course = { id: string; title: string; category: string; rating: string; students: string; author: string; price: string; oldPrice: string; image: string; tone: string }

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`

export const courses: Course[] = [
  { id: 'virtual-assistance', title: 'Professional Virtual Assistance Course', category: 'Virtual Assistance', rating: '4.7', students: '11323', author: 'Hammed Oladipo', price: '$11', oldPrice: '$27', image: unsplash('photo-1556761175-b413da4baf72'), tone: 'cyan' },
  { id: 'content-creation', title: 'Content Creation and Going Viral on Social Media', category: 'Content Creation', rating: '4.6', students: '4145', author: 'Daniel Adegahi', price: '$14', oldPrice: '$46', image: unsplash('photo-1611162617474-5b21e879e113'), tone: 'purple' },
  { id: 'cybersecurity', title: 'Professional Cybersecurity and Ethical Hacking Foundations', category: 'Cybersecurity', rating: '4.9', students: '2677', author: 'Festus Jeffrey', price: '$10', oldPrice: '$34', image: unsplash('photo-1563013544-824ae1b704d3'), tone: 'blue' },
  { id: 'mobile-skills', title: 'Smartphone Photography, Video Editing, Graphic Design, Whiteboard Animation,...', category: 'Mobile Skill Acquisition Course', rating: '4.7', students: '10145', author: 'Jameel Bin', price: '$11', oldPrice: '$37', image: unsplash('photo-1516035069371-29a1b244cc32'), tone: 'pink' },
  { id: 'full-stack-web', title: 'Full-Stack Web Development with Next.js, React & Node', category: 'Web Development', rating: '4.8', students: '8921', author: 'Qamardeen Abdul', price: '$22', oldPrice: '$74', image: unsplash('photo-1498050108023-c5249f4df085'), tone: 'blue' },
  { id: 'wordpress-business-sites', title: 'Professional Website Development with WordPress, Elementor & AI Tools', category: 'Web Development', rating: '4.5', students: '2552', author: 'Chidozie Mitchel', price: '$15', oldPrice: '$52', image: unsplash('photo-1461749280684-dccba630e2f6'), tone: 'cyan' },
  { id: 'flutter-apps', title: 'Build iOS & Android Apps with Flutter from Scratch', category: 'Mobile Development', rating: '4.6', students: '3410', author: 'Tobi Adeyemi', price: '$18', oldPrice: '$59', image: unsplash('photo-1512941937669-90a1b58e7e9c'), tone: 'purple' },
  { id: 'ui-ux-figma', title: 'UI/UX Design Masterclass: Figma, Prototyping & Design Systems', category: 'UI/UX Design', rating: '4.8', students: '5786', author: 'Amaka Nwosu', price: '$16', oldPrice: '$49', image: unsplash('photo-1561070791-2526d30994b5'), tone: 'pink' },
  { id: 'data-analysis-python', title: 'Data Analysis with Python, Excel & Power BI', category: 'Data Science', rating: '4.7', students: '6230', author: 'Ibrahim Musa', price: '$19', oldPrice: '$63', image: unsplash('photo-1551288049-bebda4e38f71'), tone: 'blue' },
  { id: 'prompt-engineering', title: 'The Complete Prompt Engineering Masterclass: From Beginner to AI Expert', category: 'Artificial Intelligence', rating: '5.0', students: '1260', author: 'Rifdhat Tolani', price: '$11', oldPrice: '$35', image: unsplash('photo-1677442136019-21780ecad995'), tone: 'purple' },
  { id: 'ai-video-creation', title: 'AI Video Creation with Veo 3: Complete AI Video Production Masterclass', category: 'Artificial Intelligence', rating: '4.6', students: '470', author: 'Emmanuel Bassey', price: '$15', oldPrice: '$51', image: unsplash('photo-1535016120720-40c646be5580'), tone: 'pink' },
  { id: 'digital-marketing-ads', title: 'Digital Marketing: Facebook, Instagram & Google Ads that Convert', category: 'Digital Marketing', rating: '4.5', students: '7314', author: 'Grace Okafor', price: '$13', oldPrice: '$42', image: unsplash('photo-1460925895917-afdab827c52f'), tone: 'cyan' },
  { id: 'airtable-automation', title: 'Airtable for Workflow Automation & Business Systems', category: 'Business', rating: '5.0', students: '163', author: 'Chidozie Okoli', price: '$11', oldPrice: '$37', image: unsplash('photo-1454165804606-c3d57bc86b40'), tone: 'blue' },
  { id: 'freelancing-business', title: 'Start a Profitable Freelancing Business on Upwork & Fiverr', category: 'Business', rating: '4.7', students: '9042', author: 'Hammed Oladipo', price: '$12', oldPrice: '$40', image: unsplash('photo-1507679799987-c73779587ccf'), tone: 'purple' },
  { id: 'dslr-photography', title: 'DSLR & Mirrorless Photography: Shoot Like a Pro', category: 'Photography', rating: '4.8', students: '2198', author: 'Kunle Bakare', price: '$14', oldPrice: '$45', image: unsplash('photo-1452587925148-ce544e77e70d'), tone: 'pink' },
  { id: 'soc-analyst', title: 'SOC Analyst Bootcamp: Threat Detection & Incident Response', category: 'Cybersecurity', rating: '4.8', students: '1534', author: 'Festus Jeffrey', price: '$20', oldPrice: '$66', image: unsplash('photo-1550751827-4bd374c3f58b'), tone: 'cyan' },
]

export const featuredCourses = courses.slice(0, 3)
export function searchCourses(query: string) { const value = query.trim().toLowerCase(); return courses.filter((course) => `${course.title} ${course.category} ${course.author}`.toLowerCase().includes(value)) }
export function getCourse(courseId: string) { return courses.find((course) => course.id === courseId) }
export function getCoursesByAuthor(author: string) { return courses.filter((course) => course.author === author) }
