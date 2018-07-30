<?php
/*
 * MyClinicSoft
 * 
 * A web based clinical system
 *
 * @package     MyClinicSoft
 * @author      Randy Rebucas
 * @copyright   Copyright (c) 2016 - 2018 MyClinicSoft, LLC
 * @license     http://www.myclinicsoft.com/license.txt
 * @link        http://www.myclinicsoft.com
 * 
 */

class Custom_Field extends CI_Model {

    private $table              = 'custom_fields';              
    private $pk                 = 'custom_field_id';
    private $dOrder             = 'asc';      

    function exists($id, $client_id)
    {
        $this->db->from($this->table);   
        $this->db->where($this->pk, $id);
        $this->db->where('client_id', $client_id);
        $query = $this->db->get();
        
        return ($query->num_rows()==1);
    }

    function count_all($client_id)
    {
        $this->db->from($this->table);
        $this->db->where('client_id', $client_id);
        return $this->db->count_all_results();
    }
    
    function get_info($id)
    {
        $this->db->from($this->table);   
        $this->db->where($this->pk, $id);
        $query = $this->db->get();
        
        if($query->num_rows()==1)
        {
            return $query->row();
        }
        else
        {

            $obj=new stdClass();

            $fields = $this->db->list_fields($this->table);
            
            foreach ($fields as $field)
            {
                $obj->$field='';
            }
            
            return $obj;
        }
    } 

    function get_by_id($id)
    {
        return $this->db->where($this->pk, $id)->get($this->table)->row();
    }
	
	function get_custom($table) 
	{
        $this->db->where('custom_field_table',$table);
		$this->db->order_by('custom_field_sort', 'asc');
        return $this->db->get('custom_fields');
	}

	function get_all_option($table, $column)
	{
		$this->db->where('custom_field_table',$table);
		$this->db->where('custom_field_column',$column);
        $this->db->order_by('custom_option_sort', 'asc');
        return $this->db->get('custom_option');
	}
	
    function save(&$custom_data, $option_data, $client_id, $id = NULL)
    {

        $success=false;
        
        //Run these queries as a transaction, we want to make sure we do all or nothing
        $this->db->trans_start();

        $original_record = $this->get_by_id($id);
        // Create the name for the custom field column
        $custom_field_column = strtolower($custom_data['custom_field_table']) . '_' . preg_replace('/[^a-zA-Z0-9_\s]/', '', strtolower(str_replace(' ', '_', $custom_data['custom_field_label'])));

        // Add the custom field column to the db array
        $custom_data['custom_field_column'] = $custom_field_column;

        if (!$id or !$this->exists($id, $client_id))
        {
            
            $success = $this->db->insert($this->table, $custom_data);
            
            if ($success) {
                // This is a new column - add itusers_custom
                
                if (isset($original_record))
                {
                    if ($original_record->custom_field_column <> $custom_data['custom_field_column'])
                    {
                        // The column name differs from the original - rename it
                        $this->rename_column($custom_data['custom_field_table'], $original_record->custom_field_column, $custom_data['custom_field_column'], $option_data);
                    }
                }
                else
                {
                    $this->add_column($custom_data['custom_field_table'], $custom_data['custom_field_column'], $option_data);
                }
                
            }
            
        }

        $this->db->where($this->pk, $id);
        $success = $this->db->update($this->table, $custom_data);

        $this->db->trans_complete();        
        return $success; 

    }

    private function add_column($table_name, $column_name, $option_data)
    {
        $this->load->dbforge();

        $column = array(
            $column_name => array(
                'type'              => 'VARCHAR',
                'constraint'        => 255
            )
        );

        $this->dbforge->add_column($table_name, $column);

        $this->insert_option($option_data, $column_name, $table_name);

    }

    private function rename_column($table_name, $old_column_name, $new_column_name, $option_data)
    {
        $this->load->dbforge();
        
        $column = array(
            $old_column_name => array(
                'name'       => $new_column_name,
                'type'              => 'VARCHAR',
                'constraint'        => 255
            )
        );

        $this->dbforge->modify_column($table_name, $column);

        $this->insert_option($option_data, $new_column_name, $table_name);
    }

    public function delete($id)
    {
        $custom_field = $this->get_by_id($id);

        if ($this->db->field_exists($custom_field->custom_field_column, $custom_field->custom_field_table))
        {
            $this->load->dbforge();
            $this->dbforge->drop_column($custom_field->custom_field_table, $custom_field->custom_field_column);
        }

        $this->db->where($this->pk, $id);

        if($this->db->delete($this->table)){
            return true;
        }else{
            return $this->db->error();
        }
    
    }

    function insert_option($option_data, $column_name, $table){

        $success = FALSE;
        //Run these queries as a transaction, we want to make sure we do all or nothing
        $this->db->trans_start();

        $success = $this->db->delete('custom_option', array('custom_field_table'=> $table, 'custom_field_column' => $column_name));
        
        if($success)
        {

            foreach($option_data as $option)
            {
                if ($option['name'] != "" || $option['sort'] != "") {
                    
                    $success = $this->db->insert('custom_option', 
                        array(
                            'custom_field_table'    => $table, 
                            'custom_field_column'   => $column_name,
                            'custom_option_name'    => $option['name'],
                            'custom_option_sort'    => $option['sort']
                        )
                    );
                }
               
            }
           
        }
  
        $this->db->trans_complete();
        return $success;
    }
}

?>