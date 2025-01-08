import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  deleteCategory,
  searchCategory,
  updateCategoryStatus,
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
  const [actionType, setActionType] = useState('');

  const columns = ['Name', 'Description'];
  const columnKeys = ['name', 'desc'];

  const handleAction = (action, row) => {
    switch (action) {
      case 'activate':
        setActionType('activate');
        setSelectedCategory(row);
        setShowDialog(true);
        break;
      case 'deactivate':
        setActionType('deactivate');
        setSelectedCategory(row);
        setShowDialog(true);
        break;
      case 'edit':
        navigate(`/event/categories/edit/${row.id}`);
        break;
      case 'delete':
        setActionType('delete');
        setSelectedCategory(row);
        setShowDialog(true);
        break;
      default:
        break;
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    const res = await deleteCategory(selectedCategory.id);
    if (!res.success) {
      return toast.error(res.error);
    }

    toast.success(res.message);
    setShowDialog(false);
    setSelectedCategory(null);
    fetchCategories();
  };

  const fetchCategories = async (query = '') => {
    setLoading(true);
    const res = await searchCategory(query);

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

  const handleChangeStatus = async () => {
    if (!selectedCategory || !actionType) return;

    const res = await updateCategoryStatus(selectedCategory.id, actionType);
    if (!res.success) {
      return toast.error(res.error);
    }

    toast.success(res.message);
    setShowDialog(false);
    setSelectedCategory(null);
    setActionType('');
    fetchCategories();
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
          className='w-64'
        />

        <CustomButton
          title='Add Category'
          onClick={() => navigate('/event/categories/add')}
          className='w-44'
        />
      </div>

      {loading ? (
        <Loader />
      ) : count === 0 ? (
        <div className='text-center'>No category found</div>
      ) : (
        <Table
          data={categories}
          columns={columns}
          columnKeys={columnKeys}
          handleAction={handleAction}
          totalRows={count}
          actions={['edit', 'delete', 'activate', 'deactivate']}
        />
      )}

      {showDialog && (
        <ConfirmDialog
          title={`Confirm ${
            actionType === 'delete'
              ? 'Deletion'
              : actionType === 'activate'
              ? 'Activation'
              : 'Deactivation'
          }`}
          message={`Are you sure you want to ${actionType} the category "${selectedCategory.name}"?`}
          onConfirm={
            actionType === 'delete' ? handleDelete : handleChangeStatus
          }
          onCancel={() => setShowDialog(false)}
        />
      )}
    </Container>
  );
};

export default Category;
