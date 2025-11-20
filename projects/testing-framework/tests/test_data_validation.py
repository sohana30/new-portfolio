"""
Data Validation Test Suite

Comprehensive tests for data pipeline validation including:
- Data type validation
- Null value checks
- Range validation
- Data quality scoring
"""

import pytest
import pandas as pd
from datetime import datetime


class TestDataValidation:
    """Test suite for data validation"""
    
    @pytest.fixture
    def sample_data(self):
        """Create sample data for testing"""
        return pd.DataFrame({
            'transaction_id': ['TXN001', 'TXN002', 'TXN003'],
            'amount': [100.50, 200.75, 150.00],
            'date': ['2024-01-01', '2024-01-02', '2024-01-03'],
            'customer_id': ['CUST001', 'CUST002', 'CUST003']
        })
    
    def test_no_null_values(self, sample_data):
        """Test that critical columns have no null values"""
        critical_columns = ['transaction_id', 'amount', 'customer_id']
        for col in critical_columns:
            assert sample_data[col].notna().all(), f"Column {col} contains null values"
    
    def test_data_types(self, sample_data):
        """Test that data types are correct"""
        assert sample_data['transaction_id'].dtype == 'object'
        assert sample_data['amount'].dtype == 'float64'
        assert sample_data['customer_id'].dtype == 'object'
    
    def test_amount_range(self, sample_data):
        """Test that amounts are within valid range"""
        assert (sample_data['amount'] > 0).all(), "Negative amounts found"
        assert (sample_data['amount'] < 1000000).all(), "Amounts exceed maximum"
    
    def test_unique_transaction_ids(self, sample_data):
        """Test that transaction IDs are unique"""
        assert sample_data['transaction_id'].is_unique, "Duplicate transaction IDs found"
    
    def test_date_format(self, sample_data):
        """Test that dates are in correct format"""
        try:
            pd.to_datetime(sample_data['date'])
        except Exception as e:
            pytest.fail(f"Invalid date format: {str(e)}")
    
    def test_row_count(self, sample_data):
        """Test expected row count"""
        expected_count = 3
        actual_count = len(sample_data)
        assert actual_count == expected_count, f"Expected {expected_count} rows, got {actual_count}"


class TestDataQuality:
    """Test suite for data quality metrics"""
    
    def test_completeness_score(self):
        """Test data completeness calculation"""
        data = pd.DataFrame({
            'col1': [1, 2, None, 4],
            'col2': [1, 2, 3, 4]
        })
        
        completeness = (data.notna().sum().sum() / (len(data) * len(data.columns))) * 100
        assert completeness >= 75, f"Data completeness {completeness}% is below threshold"
    
    def test_duplicate_detection(self):
        """Test duplicate row detection"""
        data = pd.DataFrame({
            'id': [1, 2, 2, 3],
            'value': [10, 20, 20, 30]
        })
        
        duplicates = data.duplicated().sum()
        assert duplicates == 1, f"Expected 1 duplicate, found {duplicates}"


if __name__ == "__main__":
    pytest.main([__file__, '-v'])
