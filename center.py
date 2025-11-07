import pandas as pd
import sys

def find_geographic_center_single_column(csv_file_path, column_name="latlong"):
    """
    Calculates the geographic center (average latitude and longitude)
    from a CSV file with a single combined lat,long column.

    Args:
        csv_file_path (str): The path to the CSV file.
        column_name (str): The name of the column containing "lat,long" strings.

    Returns:
        tuple: A tuple (center_lat, center_long) or None if an error occurs.
    """
    try:
        # Read the CSV file
        df = pd.read_csv(csv_file_path)

        # Check if the required 'latlong' column exists
        if column_name not in df.columns:
            print(f"Error: CSV file must contain a '{column_name}' column.", file=sys.stderr)
            return None

        # Split the single 'latlong' column into two new columns: 'lat' and 'long'
        df[['lat', 'long']] = df[column_name].str.split(',', expand=True)

        # Convert the new 'lat' and 'long' columns from strings to numbers (float)
        df['lat'] = pd.to_numeric(df['lat'], errors='coerce')
        df['long'] = pd.to_numeric(df['long'], errors='coerce')

        # Drop any rows that failed to convert (which are now NaN)
        df.dropna(subset=['lat', 'long'], inplace=True)

        if df.empty:
            print(f"Error: No valid coordinates found in '{column_name}' column.", file=sys.stderr)
            return None

        # Calculate the mean (average) of latitude and longitude
        center_lat = df['lat'].mean()
        center_long = df['long'].mean()

        return center_lat, center_long

    except FileNotFoundError:
        print(f"Error: File not found at '{csv_file_path}'", file=sys.stderr)
        return None
    except pd.errors.EmptyDataError:
        print(f"Error: CSV file '{csv_file_path}' is empty.", file=sys.stderr)
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}", file=sys.stderr)
        return None

# --- How to use the script ---
if __name__ == "__main__":
    
    # **This is your specific file path**
    # The 'r' before the string is important for Windows paths
    file_path = r'C:\Users\Aditya Atul Deshmukh\Desktop\Projects VIT\DBMS_project\smart-bins-argyle-square.csv'
    
    # The column name from your attributes
    col_name = 'latlong' 

    center_coords = find_geographic_center_single_column(file_path, col_name)

    if center_coords:
        print(f"File processed: {file_path}")
        # .6f formats the coordinates to 6 decimal places
        print(f"The geographic center is:")
        print(f"  Latitude: {center_coords[0]:.6f}")
        print(f"  Longitude: {center_coords[1]:.6f}")