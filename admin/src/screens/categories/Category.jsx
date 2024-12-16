import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getCategories } from '../../api/category';
import Breadcrumb from '../../components/common/BreadCrumb';
import Loader from '../../components/common/Loader';
import Table from '../../components/common/Table';
import Container from '../../components/Container';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const columns = ['Name', 'Description'];
  const columnKeys = ['name', 'desc'];

  const handleAction = (action, row) => {
    console.log(`${action} clicked`, row);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();
      if (!res.success) {
        return toast.error(res.error);
      }

      setCategories(res.categories);
      setCount(res.count);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  return (
    <Container>
      <Breadcrumb pageName='Category Management' />
      {loading ? (
        <Loader />
      ) : (
        <Table
          data={categories}
          columns={columns}
          columnKeys={columnKeys}
          handleAction={handleAction}
          totalRows={count}
        />
      )}
    </Container>
  );
};

export default Category;
