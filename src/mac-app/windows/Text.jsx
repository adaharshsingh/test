import { WindowControls } from '#components';
import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window';
import React from 'react';

const Text = () => {
  const { windows } = useWindowStore();
  const data = windows.txtfile.data;

  if (!data) return null;

  const { name, image, subtitle, description } = data;

  return (
    <>
      <div id='window-header'>
        <WindowControls target='txtfile' />
        <h2>{name}</h2>
      </div>
      <div className='p-8 bg-white max-w-2xl max-h-[70vh] overflow-y-auto'>
        {image && (
          <img 
            src={image} 
            alt={name} 
            className='w-full h-auto object-cover rounded-lg mb-6'
          />
        )}
        {subtitle && (
          <h3 className='text-xl font-semibold text-gray-800 mb-4'>
            {subtitle}
          </h3>
        )}
        {description && description.length > 0 && (
          <div className='space-y-4'>
            {description.map((paragraph, index) => (
              <p key={index} className='text-gray-700 leading-relaxed'>
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const TextWindow = WindowWrapper(Text, 'txtfile');

export default TextWindow;
