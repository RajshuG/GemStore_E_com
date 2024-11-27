import React from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import productCategories from './ProductDict';
import './CustomSidebar.css';
import { useState } from 'react';

const CustomSidebar = React.memo(({ closeSideBar, isOpen }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = () => {
      // Trigger animation and set isAnimating to true
      setIsAnimating(true);

      // Wait for animation to finish, then fully close the sidebar
      setTimeout(() => {
          setIsAnimating(false); // Reset animation state
          closeSideBar(); // Now close the sidebar
      }, 300); // Match this duration to your CSS animation time
  };

  console.log('sideBar is opened', isOpen)
  return (
    <div
      className={`custom-sidebar-overlay ${isOpen || isAnimating ? 'active' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`custom-sidebar ${isOpen || isAnimating ? 'active' : ''}`}
        onClick={(e) => {
          console.log("Sidebar clicked, preventing close");
          e.stopPropagation();
        }}
      >
        <Sidebar>
          <Menu>
            {productCategories.map((category) => (
              <SubMenu key={category.category} label={category.category}>
                {category.subcategories.map((subcategory) => (
                  <SubMenu key={subcategory.name} label={subcategory.name}>
                    {subcategory.products.map((product) => (
                      <MenuItem 
                        key={product} 
                        onClick={(e) => {
                          console.log(`${product} clicked`); 
                          e.stopPropagation();
                        }}
                      >
                        {product}
                      </MenuItem>
                    ))}
                  </SubMenu>
                ))}
              </SubMenu>
            ))}
          </Menu>
        </Sidebar>
      </div>
    </div>
  );
});

export default CustomSidebar;
