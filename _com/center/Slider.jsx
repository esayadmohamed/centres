"use client"
import styles from './display.module.css'
import { useState, useEffect } from "react";

import { BadgeCheck, ChevronLeft, ChevronRight, CircleSmall} from "lucide-react";

export default function DisplaySlider ({listing}){
  
    const [index, setIndex] = useState(0);
    // const [isHovered, setIsHovered] = useState(false); 

    const [imageLoaded, setImageLoaded] = useState(true);
    const [currentImage, setCurrentImage] = useState(`
        https://res.cloudinary.com/deywqqypb/image/upload/v1746453216/${listing.images[index]}`);
    
    useEffect(()=>{
        setIndex(0);
        const newImage = new window.Image(); 
        newImage.src = `https://res.cloudinary.com/deywqqypb/image/upload/v1746453216/${listing.images[0]}`;
        newImage.onload = () => {
            setCurrentImage(newImage.src);
            setImageLoaded(false);
        };
    },[listing])

    // function preloadImages (){
    //     const newImage = new window.Image(); 
    //     newImage.src = `/api/images/centers/${listing.images[newIndex]}`;
    //     newImage.onload = () => {
    //         setCurrentImage(newImage.src);
    //         setImageLoaded(false);
    //     };
    //     newImage.onerror = () => {
    //         // setError('Image failed to load. Please try again.');
    //         setImageLoaded(false);
    //     };
    // }

    function preloadImage(newIndex) {
        const newImage = new window.Image(); 
        newImage.src = `https://res.cloudinary.com/deywqqypb/image/upload/v1746453216/${listing.images[newIndex]}`;
        newImage.onload = () => {
            setCurrentImage(newImage.src);
            setImageLoaded(false);
        };
        newImage.onerror = () => {
            // setError('Image failed to load. Please try again.');
            setImageLoaded(false);
        };
    }

    function handleIndexChange(direction){
        setImageLoaded(true);
        
        setIndex((prevIndex) => {
            const newIndex = direction === 'next' 
                ? (prevIndex + 1) % listing.images.length
                : (prevIndex - 1 + listing.images.length) % listing.images.length;
            preloadImage(newIndex);
            return newIndex;
        });
    }


    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null); // reset on new touch
        setTouchStart(e.targetTouches[0].clientX);        
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
    
        if (isLeftSwipe) {
            handleIndexChange('next')
        } else if (isRightSwipe) {
            handleIndexChange('prev')
        }
    };


    return (
        <main className={styles.DisplaySlider}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            >    

            {!imageLoaded ?         
                <div className={styles.SliderContent} 
                    style={{ backgroundImage: `url('${currentImage}')`}} >

                    <div className={styles.DisplayBadge}> </div>
                    {listing.images.length > 1 && <>
                        <div className={styles.DisplayArrows} >
                            <span onClick={() => handleIndexChange('prev')}> <ChevronLeft /> </span>
                            <span onClick={() => handleIndexChange('next')}> <ChevronRight /> </span>
                        </div>
                        <div className={styles.DisplayNavigate} >
                            {listing.images.map((item, id)=> <span key={id}> <CircleSmall fill={id === index ? 'white' : 'none'}/> </span>)}
                        </div>
                    </>
                    }
                </div>
            :
                <div className={styles.SliderLoader}
                    style={{ backgroundImage: `url('${currentImage}')`}}
                    > 
                    <div className={styles.Loader}> </div> 
                </div>              
            } 
        </main>
    )
}