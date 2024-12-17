import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  deleteCategory,
  getCategories,
  searchCategory,
} from '../../api/category';
import Breadcrumb from '../../components/common/BreadCrumb';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CustomButton from '../../components/common/CustomButton';
import Loader from '../../components/common/Loader';
import Searchbar from '../../components/common/Searchbar';
import Table from '../../components/common/Table';
import Container from '../../components/Container';

const Category = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const columns = ['Name', 'Description'];
  const columnKeys = ['name', 'desc'];

  const handleAction = (action, row) => {
    if (action === 'edit') {
      navigate(`/event/categories/edit/${row.id}`);
    } else if (action === 'delete') {
      setSelectedCategory(row);
      setShowDialog(true);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    const res = await deleteCategory(selectedCategory.id);
    if (!res.success) {
      return toast.error(res.error);
    }

    const newCategories = categories.filter(
      (venue) => venue.id !== selectedCategory.id
    );
    setCategories(newCategories);
    setCount(count - 1);
    toast.success(res.message);
    setShowDialog(false);
    setSelectedCategory(null);
  };

  const fetchCategories = async (query = '') => {
    setLoading(true);
    let res;

    if (query) {
      res = await searchCategory(query);
    } else {
      res = await getCategories();
    }

    if (!res.success) {
      return toast.error(res.error);
    }

    setCategories(res.categories);
    setCount(res.count);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchCategories(query);
  };

  return (
    <Container>
      <Breadcrumb pageName='Category Management' />

      {/* header */}
      <div className='flex justify-between items-center mb-3'>
        <Searchbar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder='Search category'
          className='w-1/3'
        />

        <CustomButton
          title='Add Category'
          onClick={() => navigate('/event/categories/add')}
          className='w-1/6'
        />
      </div>

      {loading ? (
        <Loader />
      ) : count === 0 ? (
        <div className='text-center'>No data found</div>
      ) : (
        <Table
          data={categories}
          columns={columns}
          columnKeys={columnKeys}
          handleAction={handleAction}
          totalRows={count}
          actions={['edit', 'delete']}
        />
      )}

      {showDialog && (
        <ConfirmDialog
          title='Confirm Deletion'
          message={`Are you sure you want to delete the category "${selectedCategory.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setShowDialog(false)}
        />
      )}
    </Container>
  );
};

export default Category;
