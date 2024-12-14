import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
	return (
		<div className='relative overflow-hidden h-96 w-full rounded-lg group shadow-lg hover:shadow-2xl transition-shadow duration-500'>
			<Link to={"/category" + category.href}>
				<div className='w-full h-full cursor-pointer relative'>
					{/* Shiny effect */}
					<div className='absolute inset-0 bg-gradient-to-r from-transparent to-white/50 via-white/80 opacity-0 group-hover:opacity-100 group-hover:animate-shine z-20'></div>
					
					{/* Background image */}
					<img
						src={category.imageUrl}
						alt={category.name}
						className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110'
						loading='lazy'
					/>

					{/* Overlay gradient */}
					<div className='absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-80 z-10'></div>

					{/* Text content */}
					<div className='absolute bottom-0 left-0 right-0 p-6 z-30'>
						<h3 className='text-white text-2xl font-bold mb-2 transition-transform duration-500 group-hover:translate-y-1'>
							{category.name}
						</h3>
						<p className='text-gray-300 text-sm'>Explore {category.name}</p>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default CategoryItem;
