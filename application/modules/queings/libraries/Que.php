<?php
class Que extends CI_Cart {

    function __construct() 
    {
        parent::__construct();
        $this->product_name_rules = '\d\D';
    }

    /*
     * Returns data for products in cart
     * 
     * @param integer $product_id used to fetch only the quantity of a specific product
     * @return array|integer $in_cart an array in the form (id => quantity, ....) OR quantity if $product_id is set
     */
    public function in_cart($product_id = null) {
        if ($this->total_items() > 0)
        {
            $in_cart = array();
            // Fetch data for all products in cart
            foreach ($this->contents() AS $items)
            {
                
                foreach ($this->product_options($items['rowid']) as $option_name => $option_value){
                    if($option_name == 'patient_id') {
                        $in_cart[$option_value] = $items['qty'];
                    }
                    
                }
            }
            if ($product_id)
            {
                if (array_key_exists($product_id, $in_cart))
                {
                    return $in_cart[$product_id];
                }
                return null;
            }
            else
            {
                return $in_cart;
            }
        }
        return null;    
    }

    public function all_item_count()
    {
        $total = 0;

        if ($this->total_items() > 0)
        {
            foreach ($this->contents() AS $item)
            {
                $total = $item['qty'] + $total;
            }
        }

        return $total;
    }

    /*
     * Returns row id
     * 
     */
    public function next() {

        if ($this->total_items() > 0)
        {
            $cart = array();
            // Fetch data for all products in cart
            foreach ($this->contents() AS $items)
            {
                $cart[$items['rowid']] = $items['qty'];
            }
            //always select second array
            $second = array_slice($cart, 1);
            //get the key of second array
            return key($second);
        }
        return null;    
    }
}
 /* End of file: Que.php */
 /* Location: ./application/libraries/Que.php */