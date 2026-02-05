import { WindowControls } from '#components';
import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window';
import React from 'react';

const Image = () => {
  const { windows } = useWindowStore();
  const data = windows.imgfile.data;

  if (!data) return null;

  const { name, imageUrl } = data;

  return (
    <>
      <div id='window-header'>
        <WindowControls target='imgfile' />
        <p className='font-bold text-[#5f6266]'>{name}</p>
      </div>
      <div className='preview'>
        <img 
          src={imageUrl} 
          alt={name} 
          className='w-full h-fit object-contain object-center'
        />
      </div>
    </>
  );
};

const ImageWindow = WindowWrapper(Image, 'imgfile');

export default ImageWindow;
