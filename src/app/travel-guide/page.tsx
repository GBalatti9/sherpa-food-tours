import { wp } from "@/lib/wp"
import "./travel-guide.css";
import Link from "next/link";
import { slugify } from "../helpers/slugify";
import { WPPost } from "@/types/post";
import { Category } from "@/types/category";
import React from "react";

interface CompletePost {
    category: string;
    posts: WPPost[]
}

export default async function TravelGuidePage() {

    // const { title, content } = await wp.getPageInfo("travel-guide")
    const posts = await wp.getAllPost();
    const categories = await wp.getAllCategories();

    // console.log({categories});
    // console.log(posts[0]);

    const data: CompletePost[] = categories.map((cat: Category) => {
        const filteredPosts = posts.filter((post: WPPost) => post.categories.includes(cat.id));
        return {
            category: cat.name,
            posts: filteredPosts
        };
    }).filter((group: CompletePost) => group.posts.length > 0);



    // console.log(slugify(posts[0].relaciones.ciudades[0].title));


    const images = ["https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1200px-Good_Food_Display_-_NCI_Visuals_Online.jpg", "https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1200px-Good_Food_Display_-_NCI_Visuals_Online.jpg"]

    const images2 = ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1200px-Good_Food_Display_-_NCI_Visuals_Online.jpg", "https://www.eatingwell.com/thmb/m5xUzIOmhWSoXZnY-oZcO9SdArQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/article_291139_the-top-10-healthiest-foods-for-kids_-02-4b745e57928c4786a61b47d8ba920058.jpg"]
    return (
        <>
            <section className="travel-guide-first-section">
                <div className="imgs-galleries">
                    <div className="img-gallery">
                        {images.map((src, index) => (
                            <div className="img-container" key={index}>
                                <img key={index} src={src} alt={`img-${index}`} />
                            </div>
                        ))}
                    </div>
                    <div className="img-gallery right">
                        {images2.map((src, index) => (
                            <div className="img-container" key={index}>
                                <img key={index} src={src} alt={`img-${index}`} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="titles-container">
                    <h1>
                        <span>
                            The
                            <svg xmlns="http://www.w3.org/2000/svg" width="152" height="61" viewBox="0 0 152 61" fill="none">
                                <g clipPath="url(#clip0_342_8465)">
                                    <path d="M67.2008 7.80992C69.6648 7.25447 72.0989 6.69159 74.5406 6.16287C76.1236 5.8198 77.5844 5.83613 78.6725 7.37328C79.3851 8.38171 79.2315 9.16142 78.0405 9.57281C73.752 11.0565 69.4457 12.4926 65.1885 14.0625C64.4834 14.3224 63.7411 15.0501 63.4459 15.7422C62.2609 18.5298 61.2443 21.3873 60.0533 24.5121C60.6555 24.3517 61.0684 24.2314 61.4858 24.1304C62.6515 23.8512 63.8171 23.5779 64.9843 23.3061C66.29 23.0032 67.2843 23.4131 68.1921 24.4215C69.3145 25.669 69.2921 26.6804 67.7046 27.322C65.0215 28.4062 62.2877 29.3805 59.5212 30.227C58.5761 30.5166 58.0216 30.8211 58.0902 31.8191C58.2333 33.9102 58.3346 36.0102 58.6044 38.0865C58.7282 39.0429 59.4049 39.3058 60.4498 39.0103C63.0405 38.2781 65.4434 37.2266 67.5138 35.4934C68.8986 34.335 70.4831 34.3825 72.0557 34.8518C73.5284 35.2914 73.9339 37.3291 72.7757 38.3197C69.2534 41.3345 65.1452 43.289 60.663 44.2871C59.1008 44.6361 57.3091 44.2291 55.6724 43.9113C53.8867 43.5653 52.8209 42.2004 52.4765 40.5043C51.998 38.1533 51.5479 35.7845 52.3409 33.3548C52.7583 32.0775 53.0802 30.6874 52.01 29.4116C51.8311 29.1993 52.1084 28.2146 52.4199 28.0527C53.7808 27.3458 54.149 26.119 54.5828 24.8165C55.5412 21.9368 56.6219 19.0972 57.6475 16.2397C57.7101 16.0645 57.7265 15.8729 57.7369 15.8194C56.9126 15.0828 56.1226 14.4679 55.4473 13.7476C54.869 13.1298 54.936 12.3991 55.8244 12.1822C59.2126 11.358 61.4247 9.16439 63.2253 6.33069C63.6248 5.70247 64.5982 5.24355 65.3837 5.08909C67.016 4.7683 67.563 5.64603 67.1993 7.80843L67.2008 7.80992Z" fill="white" />
                                    <path d="M30.1434 27.2323C28.2652 27.4164 27.2754 26.6813 26.8342 25.2941C26.7314 24.9719 26.9162 24.3065 27.1696 24.1714C28.2279 23.604 29.325 22.9669 30.4803 22.7575C31.6862 22.5392 31.9738 21.7802 32.3659 20.8921C34.0383 17.1034 35.7242 13.3207 37.4667 9.56327C37.7336 8.98702 38.2523 8.26226 38.7844 8.13157C39.6073 7.93107 40.6224 7.9979 41.3885 8.33206C41.7165 8.47464 41.8655 9.65238 41.6792 10.2271C40.9518 12.4697 40.0425 14.6529 39.2346 16.8703C38.698 18.3421 38.215 19.8332 37.6218 21.5679C39.4895 21.3881 41.0725 21.3183 42.6153 21.0332C43.0297 20.9575 43.453 20.2832 43.6513 19.7946C44.7052 17.2015 45.5757 14.5297 46.7339 11.9871C47.5686 10.1558 48.6583 8.41523 49.8388 6.78155C50.2502 6.21125 51.2609 5.85332 52.0241 5.80431C53.2628 5.7256 53.9201 6.58551 53.4983 7.78255C52.27 11.2727 50.9091 14.7168 49.5869 18.1743C49.2992 18.9272 48.9608 19.6624 48.6165 20.4733C49.0518 20.6426 49.4677 20.6768 49.6376 20.898C50.0624 21.455 50.4962 22.0654 50.6646 22.7203C50.7183 22.9312 49.9819 23.5773 49.5526 23.6352C46.8457 24.0035 46.1406 26.0932 45.3342 28.1917C44.3653 30.7135 43.3398 33.2175 42.2337 35.6829C41.6449 36.9958 40.9265 38.2745 40.0902 39.4418C39.6773 40.0181 38.9186 40.4859 38.2225 40.6938C36.5023 41.2062 35.7004 40.4799 36.2579 38.8284C36.9734 36.7121 37.9557 34.6848 38.8053 32.613C39.0602 31.9893 39.251 31.3388 39.4776 30.7046C40.0604 29.0798 40.6477 27.4565 41.3572 25.4887C39.4686 25.7961 37.7455 26.0412 36.0432 26.3872C35.7689 26.4437 35.5096 26.9204 35.3769 27.2546C33.6195 31.6952 31.874 36.1388 30.1523 40.5943C29.6172 41.9785 28.7064 42.8592 27.2054 43.0315C25.676 43.2082 24.9754 42.629 25.3451 41.1527C25.9637 38.6874 26.7925 36.271 27.6227 33.8635C28.3576 31.7353 29.2162 29.6486 30.1404 27.2323H30.1434Z" fill="white" />
                                    <path d="M138.446 12.0868C139.189 10.9788 139.979 10.3194 141.315 11.1585C142.087 11.6427 142.314 12.1506 141.998 12.9363C141.819 13.3803 141.647 13.86 141.348 14.2194C139.836 16.0269 140.5 17.7601 141.403 19.5438C142.074 20.8685 142.739 22.2141 143.202 23.6176C143.499 24.5176 143.708 24.7686 144.69 24.4225C146.094 23.9265 147.573 23.5582 149.048 23.3948C149.555 23.3384 150.323 23.9562 150.636 24.4701C150.828 24.7834 150.549 25.728 150.196 25.9686C148.613 27.0394 146.927 27.9587 145.07 29.0562C146.654 32.934 148.237 36.7925 149.807 40.6584C149.968 41.0549 150.075 41.4767 150.168 41.894C150.432 43.0955 150.546 44.3475 150.965 45.4896C151.336 46.5025 151.204 47.1916 150.298 47.6847C149.315 48.2178 148.23 48.3768 147.65 47.2109C146.453 44.799 145.329 42.344 144.304 39.8549C143.132 37.0093 142.129 34.0954 140.971 31.2439C140.856 30.9632 140.114 30.684 139.775 30.785C137.785 31.3701 135.842 32.1053 133.859 32.7172C132.473 33.1434 131.477 33.834 131.061 35.3311C130.52 37.2811 129.915 39.2252 129.15 41.095C128.752 42.0678 128.038 42.9618 127.287 43.7133C127.016 43.9851 126.123 43.902 125.695 43.6614C125.431 43.5128 125.392 42.745 125.455 42.2831C125.749 40.1311 126.136 37.9999 127.351 36.1182C127.537 35.8301 127.531 35.4202 127.63 35.0073C126.534 35.2375 125.561 35.6548 124.637 35.5657C123.957 35.5004 123.268 34.8424 122.739 34.2989C122.557 34.1132 122.696 33.2548 122.951 33.0736C124.163 32.2167 125.379 31.2186 126.756 30.7731C129.065 30.0261 130.299 28.4414 130.785 26.3057C131.467 23.3101 132.917 20.7215 134.654 18.2829C135.818 16.6492 135.591 15.262 134.654 13.6462C133.765 12.112 133.117 10.4352 132.425 8.79563C131.787 7.28373 133.026 6.84857 133.999 6.36144C135.007 5.85797 135.332 6.70303 135.715 7.36838C136.597 8.90107 137.484 10.4308 138.444 12.0912L138.446 12.0868ZM134.37 27.3884C134.466 27.4671 134.563 27.5458 134.658 27.6245C135.834 27.2057 137.021 26.8062 138.182 26.3503C138.443 26.2478 138.847 25.8765 138.806 25.7399C138.408 24.3973 137.931 23.0785 137.384 21.4849C136.254 23.6993 135.312 25.5438 134.37 27.3899V27.3884Z" fill="white" />
                                    <path d="M89.1624 28.2409C92.248 30.5875 95.4066 32.845 98.3967 35.3059C101.202 37.6138 103.87 40.0955 106.5 42.604C106.922 43.0065 107.109 44.45 106.923 44.554C105.799 45.1793 104.44 44.8124 103.341 44.6149C101.63 44.3089 99.8635 43.4505 98.4802 42.3708C95.3156 39.901 92.3717 37.149 89.3293 34.5247C88.8568 34.1177 88.3291 33.7732 87.6032 33.2356C87.156 35.3876 86.8221 38.5524 86.3496 40.4074C86.1305 41.2644 85.6595 42.0619 85.2689 42.8698C84.4565 44.551 83.899 44.3981 82.392 43.954C80.7032 43.4565 80.8403 42.1866 81.0564 40.9807C81.5245 38.3713 82.0775 35.7737 82.6767 33.191C83.1418 31.1845 83.9631 29.2969 81.52 27.7583C80.2441 26.9548 80.6272 25.4251 82.1014 24.9112C84.5042 24.0751 85.6386 22.5587 85.5506 19.9879C85.494 18.3334 85.7295 16.6685 85.8428 14.8641C85.2898 14.9339 84.0943 14.9844 83.6665 15.0408C81.444 15.3349 81.1027 14.6353 80.8806 12.7967C80.5884 10.3893 81.5707 9.0942 83.8484 8.98281C85.2361 8.91449 86.3317 8.85509 87.1292 7.23329C88.0355 5.38723 90.2997 5.45257 91.4043 7.26893C92.1362 8.47191 93.0305 8.70806 94.2185 8.82538C96.8867 9.08826 99.4417 9.66896 101.785 11.1155C104.264 12.6452 105.571 14.8091 105.792 17.6309C105.842 18.2859 105.625 19.0998 105.24 19.6314C102.244 23.7721 97.8214 25.5483 93.0693 26.729C91.8261 27.038 90.5651 27.2786 89.3129 27.5503C89.2623 27.7805 89.2116 28.0122 89.1609 28.2424L89.1624 28.2409ZM89.7184 22.226C89.9673 22.3226 90.2028 22.5127 90.3564 22.4607C93.9979 21.231 97.6798 20.0443 100.543 17.322C101.71 16.2126 100.944 15.118 99.8695 14.7453C97.6947 13.9908 95.4289 13.4264 93.1572 13.0418C91.7725 12.8071 90.9616 13.5675 90.817 15.1656C90.6038 17.5255 90.1 19.8587 89.7169 22.2245L89.7184 22.226Z" fill="white" />
                                    <path d="M109.329 60.6077C109.243 59.3215 109.023 58.2552 109.128 57.2215C109.706 51.4695 110.386 45.7278 110.979 39.9772C111.225 37.5876 111.34 35.1846 111.517 32.7653C111.015 32.5782 110.405 32.5381 110.165 32.2217C109.666 31.5623 109.168 30.7811 109.068 29.9984C109.023 29.645 109.866 28.9603 110.419 28.791C111.802 28.3662 112.376 27.6623 112.452 26.1355C112.598 23.1696 113.044 20.2171 113.386 17.0745C112.638 17.0404 111.891 16.9616 111.146 16.9809C109.94 17.0121 109.556 16.2502 109.392 15.2686C109.214 14.2052 109.931 13.9735 110.763 13.8339C111.237 13.7552 111.704 13.5086 112.17 13.5161C113.255 13.5354 114.088 13.5116 114.229 12.0457C114.323 11.067 115.306 10.9883 116.198 11.0581C117.1 11.1279 117.593 11.6492 117.536 12.4512C117.432 13.9319 118.076 14.37 119.49 14.572C121.37 14.8408 123.217 15.1943 124.87 16.4701C127.966 18.8612 127.555 24.282 125.2 26.7682C122.901 29.1949 120.166 30.9445 116.94 31.9395C116.505 32.0732 116.074 32.6376 115.901 33.0994C115.67 33.7143 115.716 34.4287 115.606 35.094C115.223 37.4064 114.551 39.7099 114.488 42.0312C114.348 47.2085 112.987 52.1853 112.337 57.272C112.122 58.9532 111.046 59.721 109.33 60.6062L109.329 60.6077ZM116.561 26.5885C119.045 25.1345 121.662 24.3964 122.953 21.8211C123.224 21.2805 123.318 20.6419 123.442 20.0389C123.646 19.0409 123.093 18.4483 122.217 18.2121C121.054 17.8988 119.866 17.6418 118.672 17.4829C117.782 17.3641 117.119 17.5988 117.077 18.7795C116.989 21.2567 116.758 23.7295 116.56 26.587L116.561 26.5885Z" fill="white" />
                                    <path d="M2.32809 30.425C2.5338 29.6705 3.07638 28.8017 3.96479 29.216C4.5655 29.4967 5.01567 30.3344 5.2959 31.0205C6.52566 34.022 5.28994 37.1067 5.48074 40.1617C5.65365 42.9226 8.21601 43.9815 10.4534 42.7058C14.0234 40.6696 16.0715 37.7661 17.0032 33.9448C17.4638 32.0527 18.057 30.2348 17.9512 28.1541C17.8051 25.2744 16.5068 22.9947 15.1831 20.66C13.3661 17.452 11.7353 14.1772 11.0854 10.5133C10.6308 7.95292 12.3763 6.24795 13.7313 4.49397C15.4619 2.25286 17.8558 0.7172 20.6298 0.236007C22.7569 -0.1338 25.1732 -0.353604 26.634 1.92018C27.1035 2.65237 27.5164 3.6103 27.4762 4.44199C27.3406 7.22371 26.6191 9.85245 24.5412 11.9035C23.5395 12.8911 22.4752 12.8124 21.0561 11.7252C20.0679 10.9678 20.1648 10.1124 20.7819 9.19155C21.4258 8.23065 22.107 7.29202 22.6973 6.29993C23.0103 5.77567 23.304 5.17269 23.3666 4.5816C23.5261 3.06673 22.7152 2.5187 21.3394 3.12614C19.1437 4.09446 18.1509 6.14251 16.9719 8.01381C16.638 8.54253 16.4129 9.14105 16.0686 9.66383C15.0132 11.2678 14.9789 12.7574 15.924 14.5322C17.8856 18.2154 19.7519 21.964 21.3811 25.8031C23.3219 30.3745 22.2919 34.6785 19.8443 38.8785C17.8692 42.2662 15.1339 44.5622 11.5118 45.8781C7.84932 47.2088 3.18669 46.1722 1.17883 42.4028C0.640721 41.3929 0.522963 40.4127 0.353034 38.8815C0.110064 37.1156 1.57533 33.2067 2.33107 30.4309L2.32809 30.425Z" fill="white" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_342_8465">
                                        <rect width="150.839" height="60.6051" fill="white" transform="translate(0.320312)" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </span>
                        Travel Guide </h1>
                    <h2>experiences made to be remembered</h2>
                    <Link href="/" className="btn-cta">Explore The Guide</Link>
                </div>
            </section>
            <section className="travel-guide-second-section">
                <div className="second-section-main-container">
                    <div className="main-searcher">
                        <p className="searcher">Explore Our Cities</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                            <path d="M15.6484 8.02881L10.7109 12.9663L5.77344 8.02881" stroke="#0A4747" strokeWidth="1.64583" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="icons">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M6.44727 13.8149L15.6556 13.8149" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M11.0527 9.21094L15.6569 9.21094" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7.51042 9.21094L2.90625 9.21094" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2.90625 4.60693L12.1146 4.60693" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6.44792 13.8151C6.44792 12.8371 5.65508 12.0443 4.67708 12.0443C3.69908 12.0443 2.90625 12.8371 2.90625 13.8151C2.90625 14.7931 3.69908 15.5859 4.67708 15.5859C5.65508 15.5859 6.44792 14.7931 6.44792 13.8151Z" stroke="#0A4747" strokeWidth="1.41667" strokeLinejoin="round" />
                            <path d="M11.0514 9.2111C11.0514 8.2331 10.2586 7.44027 9.2806 7.44027C8.3026 7.44027 7.50977 8.2331 7.50977 9.2111C7.50977 10.1891 8.3026 10.9819 9.2806 10.9819C10.2586 10.9819 11.0514 10.1891 11.0514 9.2111Z" stroke="#0A4747" strokeWidth="1.41667" strokeLinejoin="round" />
                            <path d="M15.6569 4.60661C15.6569 3.62861 14.8641 2.83577 13.8861 2.83577C12.9081 2.83577 12.1152 3.62861 12.1152 4.60661C12.1152 5.5846 12.9081 6.37744 13.8861 6.37744C14.8641 6.37744 15.6569 5.5846 15.6569 4.60661Z" stroke="#0A4747" strokeWidth="1.41667" strokeLinejoin="round" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M8.2181 14.1691C11.5433 14.1691 14.2389 11.4735 14.2389 8.14827C14.2389 4.82307 11.5433 2.12744 8.2181 2.12744C4.8929 2.12744 2.19727 4.82307 2.19727 8.14827C2.19727 11.4735 4.8929 14.1691 8.2181 14.1691Z" stroke="#0A4747" strokeWidth="1.41667" strokeLinejoin="round" />
                            <path d="M10.2218 5.79079C9.70905 5.27806 9.00072 4.96094 8.21829 4.96094C7.4359 4.96094 6.72757 5.27806 6.21484 5.79079" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12.5469 12.4771L15.5521 15.4823" stroke="#0A4747" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </section>
            <section className="travel-guide-third-section-main-container">

                {/* First Section */}
                <>
                    <div className="travel-guide-third-section">
                        {posts.map((post: WPPost, i: number) => {
                            let slug;

                            // console.log({ post });


                            if (post.relaciones.ciudades && post.relaciones.ciudades.length > 0) {
                                slug = post.relaciones.ciudades[0]!.title;

                            } else {
                                slug = null
                            }

                            let url = null;

                            if (!slug) {
                                url = "https://www.sherpafoodtours.com/travel-guide"
                            } else {
                                url = `${process.env.NEXT_PUBLIC_BASE_URL}/travel-guide/${slugify(post.relaciones.ciudades[0]!.title)}/${post.slug}`
                            }

                            // ------------------
                            // SOLO PARA MOBILE
                            // ------------------

                            // Render del primer elemento
                            if (i === 0) {
                                return (
                                    <div className={`preview-wrapper element-${i}`} key={post.id}>
                                        <a className="preview-item" href={url} target="_blank" rel="noopener noreferrer">
                                            <div className="preview-image-container">
                                                <img decoding="async" src="http://localhost:8881/wp-content/uploads/2025/07/bd-300x200.jpg" alt={post.title.rendered} />
                                                <p className="preview-city">{slug}</p>
                                            </div>
                                            <div className="preview-data">
                                                <h3>{post.title.rendered}</h3>
                                                <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} className="description"></div>
                                                <p className="preview-author"><span>Por: </span>{post.author}</p>
                                            </div>
                                        </a>
                                    </div>
                                );
                            }

                            // // Render del grupo de i === 1 y i === 2
                            if (i === 1) {
                                return (
                                    <div className="preview-wrapper-group" key="group-1-2">
                                        {[posts[1], posts[2]].map((p) => {
                                            const s = p.relaciones?.ciudades?.[0]?.title || null;
                                            const u = s
                                                ? `https://www.sherpafoodtours.com/travel-guide/${slugify(s)}/${p.slug}`
                                                : "https://www.sherpafoodtours.com/travel-guide";

                                            return (
                                                <div className="preview-wrapper" key={p.id}>
                                                    <a className="preview-item" href={u} target="_blank" rel="noopener noreferrer" key={p.id}>
                                                        <div className="preview-image-container">
                                                            <img decoding="async" src="http://localhost:8881/wp-content/uploads/2025/07/bd-300x200.jpg" alt={p.title.rendered} />
                                                            <p className="preview-city">{s}</p>
                                                        </div>
                                                        <div className="preview-data">
                                                            <h3>{p.title.rendered}</h3>
                                                            <p className="preview-author"><span>Por: </span>{p.author}</p>
                                                        </div>
                                                    </a>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            }

                            // // Elementos con i > 2
                            if (i > 2) {
                                return (
                                    <div className="preview-wrapper list" key={post.id}>
                                        <a className="preview-item" href={url} target="_blank" rel="noopener noreferrer">
                                            <div className="preview-image-container">
                                                <img decoding="async" src="http://localhost:8881/wp-content/uploads/2025/07/bd-300x200.jpg" alt={post.title.rendered} />
                                                <p className="preview-city">{slug}</p>
                                            </div>
                                            <div className="preview-data">
                                                <h3>{post.title.rendered}</h3>
                                                <p className="preview-author"><span>Por: </span>{post.author}</p>
                                            </div>
                                        </a>
                                    </div>
                                );
                            }

                            return null;

                            // return (

                            //     <React.Fragment key={post.id}>
                            //         {i === 0 && (
                            //             <div className="preview-wrapper">
                            //                 <a className="preview-item" href={url} target="_blank" rel="noopener noreferrer">
                            //                     <div className="preview-image-container">
                            //                         <img decoding="async" src="http://localhost:8881/wp-content/uploads/2025/07/bd-300x200.jpg" alt={post.title.rendered} />
                            //                         <p className="preview-city">{slug}</p>
                            //                     </div>
                            //                     <div className="preview-data">
                            //                         <h3>{post.title.rendered}</h3>
                            //                         <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} className="description"></div>
                            //                         <p className="preview-author"><span>Por: </span>{post.author}</p>
                            //                     </div>
                            //                 </a>
                            //             </div>
                            //         )}

                            //         {(i === 1 || i === 2) && (
                            //             <div className="preview-wrapper-group">
                            //                 <a className="preview-item" href={url} target="_blank" rel="noopener noreferrer">
                            //                     <div className="preview-image-container">
                            //                         <img decoding="async" src="http://localhost:8881/wp-content/uploads/2025/07/bd-300x200.jpg" alt={post.title.rendered} />
                            //                         <p className="preview-city">{slug}</p>
                            //                     </div>
                            //                     <div className="preview-data">
                            //                         <h3>{post.title.rendered}</h3>
                            //                         <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} className="description"></div>
                            //                         <p className="preview-author"><span>Por: </span>{post.author}</p>
                            //                     </div>
                            //                 </a>
                            //             </div>
                            //         )}
                            //     </React.Fragment>
                            // )
                        })}
                    </div>
                    <Link href="/" className="show-more">Show more</Link>
                </>

                {/* Second Section */}
                {data.map((element, i) => (
                    <div className="category-container" key={element.category + i}>
                        <h3 className="category-title">{element.category}</h3>
                        <div className="travel-guide-third-section">
                            {element.posts.map((post) => {
                                let slug;

                                if (post.relaciones.ciudades && post.relaciones.ciudades.length > 0) {
                                    slug = post.relaciones.ciudades[0]!.title;

                                } else {
                                    slug = null
                                }

                                let url = null;

                                if (!slug) {
                                    url = "https://www.sherpafoodtours.com/travel-guide"
                                } else {
                                    url = `${process.env.NEXT_PUBLIC_BASE_URL}/travel-guide/${slugify(post.relaciones.ciudades[0]!.title)}/${post.slug}`
                                }

                                return (
                                    <div className={`preview-wrapper`} key={post.id}>
                                        <a className="preview-item" href={url} target="_blank" rel="noopener noreferrer">
                                            <div className="preview-image-container">
                                                <img decoding="async" src="http://localhost:8881/wp-content/uploads/2025/07/bd-300x200.jpg" alt={post.title.rendered} />
                                                <p className="preview-city">{slug}</p>
                                            </div>
                                            <div className="preview-data">
                                                <h3>{post.title.rendered}</h3>
                                                <p className="preview-author"><span>Por: </span>{post.author}</p>
                                            </div>
                                        </a>
                                    </div>
                                )
                            })}
                        </div>
                        <Link href="/" className="show-more">Show more</Link>
                    </div>
                ))}
            </section>
        </>
    )
}
