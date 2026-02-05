import { WindowControls } from '#components';
import { gallery, photosLinks } from '#constants';
import WindowWrapper from '#hoc/WindowWrapper';
import useWindowStore from '#store/window';
import { Mail, Search } from 'lucide-react';
import React from 'react';

const Gallery = () => {
  const { openWindow } = useWindowStore();

  return (
    <>
      <div id='window-header'>
        <WindowControls target='photos' />
        <h2>Photos</h2>
        <div className='flex items-center gap-3 text-gray-500'>
          <Mail className='icon' />
          <Search className='icon' />
        </div>
      </div>
      <div className='flex w-full h-full'>
        <div className='sidebar'>
          <h2>Albums</h2>
          <ul>
            {photosLinks.map(({ id, icon, title }) => (
              <li key={id}>
                <img src={icon} alt={title} />
                <p>{title}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className='gallery'>
          <ul>
            {gallery.map(({ id, img }) => (
              <li
                key={id}
                className='cursor-pointer hover:opacity-90 transition-opacity'
                onClick={() =>
                  openWindow('imgfile', {
                    id,
                    name: `Gallery Image ${id}`,
                    icon: '/images/image.png',
                    kind: 'file',
                    fileType: 'img',
                    imageUrl: img,
                  })
                }
              >
                <img src={img} alt={`Gallery ${id}`} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

const GalleryWindow = WindowWrapper(Gallery, 'photos');

export default GalleryWindow;
