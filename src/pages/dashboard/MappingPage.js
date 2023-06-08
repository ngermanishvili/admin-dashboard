import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
// @mui
import { Box, Container, Grid, LinearProgress, Stack } from '@mui/material';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { LoadingButton } from '@mui/lab';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getBoard, persistColumn, persistCard } from '../../redux/slices/kanban';
import {
  fetchDataFeatureMap,
  getFeaturevalueMap,
  sendMainData,
  updateMappedColumns,
} from '../../redux/slices/features';
// routes
import { PATH_APP, PATH_DASHBOARD } from '../../routes/paths';
// utils
import { hideScrollbarX } from '../../utils/cssStyles';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { SkeletonKanbanColumn } from '../../components/skeleton';
// sections
import { KanbanColumn, KanbanColumnAdd } from '../../sections/@dashboard/kanban';
import { AppTopAuthors } from '../../sections/@dashboard/general/app';
import { _appAuthors } from '../../_mock/arrays';

// ----------------------------------------------------------------------

export default function MappingPage() {
  const feature = useSelector((state) => state.feature);
  console.log(feature);
  const { featureColumns } = feature.currentSelection;
  console.log(featureColumns);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDataFeatureMap());
  }, [dispatch]);

  const modelMainData = () => {
    // {\”tableCfg\”: {“table”: “Table Name”,”cols” : “col1,col2,col3”},
    // \”lineage\”: {“col”:”column”, “from”:”fromDate”, “to”:”toDate”}}
    const temp = {
      tableCfg: {
        table: '',
        cols: [],
      },
      lineage: {
        col: '',
        from: '',
        to: '',
      },
    };
    temp.tableCfg.table =
      feature.currentSelection.table.tableNames[feature.currentSelection.table.selected];
    temp.tableCfg.cols = feature.currentSelection.selectedColumns;
    temp.lineage.col = feature.currentSelection.dateColName;
    temp.lineage.from = feature.currentSelection.currentStartDate;
    temp.lineage.to = feature.currentSelection.currentEndDate;

    return temp;
  };

  const { board } = useSelector((state) => state.kanban);
  console.log(board);
  const dSourceId = useSelector((state) => state.feature.currentSelection.currentDsKey);

  useEffect(() => {
    dispatch(getBoard(feature.currentSelection));

    dispatch(sendMainData(modelMainData(), dSourceId));
    // eslint-disable-next-line
  }, [dispatch]);

  const kanbanUpdate = useSelector((state) => state.kanban);
  console.log(kanbanUpdate.board.columns.mapped.cardIds);

  useEffect(() => {
    console.log('chal ra');
    dispatch(updateMappedColumns(kanbanUpdate.board.columns.mapped.cardIds));
  }, [kanbanUpdate, dispatch]);

  const value = {
    projectKey: feature.currentSelection.projectKey,
    dSource: feature.currentSelection.currentDsKey,
    feature: feature.currentSelection.featureColumns[0],
  };
  const body = {
    fsProject: feature.currentSelection.category,
    fsCategory: feature.currentSelection.subCategory,
    dSource: feature.currentSelection.currentDsKey,
  };
  useEffect(() => {
    dispatch(getFeaturevalueMap({ value, body }));
    // eslint-disable-next-line
  }, []);

  console.log(useSelector((state) => state.feature.currentSelection.mappedColumns));
  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index)
      return;

    if (type === 'column') {
      const newColumnOrder = Array.from(board.columnOrder);

      newColumnOrder.splice(source.index, 1);

      newColumnOrder.splice(destination.index, 0, draggableId);

      dispatch(persistColumn(newColumnOrder));
      return;
    }

    const start = board.columns[source.droppableId];
    const finish = board.columns[destination.droppableId];

    if (start.id === finish.id) {
      const updatedCardIds = [...start.cardIds];

      updatedCardIds.splice(source.index, 1);

      updatedCardIds.splice(destination.index, 0, draggableId);

      const updatedColumn = {
        ...start,
        cardIds: updatedCardIds,
      };

      dispatch(
        persistCard({
          ...board.columns,
          [updatedColumn.id]: updatedColumn,
        })
      );
      return;
    }

    const startCardIds = [...start.cardIds];

    startCardIds.splice(source.index, 1);

    const updatedStart = {
      ...start,
      cardIds: startCardIds,
    };

    const finishCardIds = [...finish.cardIds];

    finishCardIds.splice(destination.index, 0, draggableId);

    const updatedFinish = {
      ...finish,
      cardIds: finishCardIds,
    };

    dispatch(
      persistCard({
        ...board.columns,
        [updatedStart.id]: updatedStart,
        [updatedFinish.id]: updatedFinish,
      })
    );
  };
  const requiredId = Object.keys(board.columns).filter(
    (key) => board.columns[key].id === 'mapped'
  )[0];
  const requiredCol = board.columns[requiredId]?.cardIds;
  const progress =
    (feature.currentSelection.mappedColumns.length /
      feature.currentSelection.featureColumns.length) *
      100 >
    100
      ? 100
      : (feature.currentSelection.mappedColumns.length /
          feature.currentSelection.featureColumns.length) *
        100;

  return (
    <>
      <Helmet>
        <title>Column Mapping | S7</title>
      </Helmet>

      <Container maxWidth={false} sx={{ height: 1 }}>
        <CustomBreadcrumbs
          heading="Column Mapping"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            { name: 'Column Mapping' },
          ]}
        />
        <Box sx={{ width: '100%', p: 5 }}>
          <LinearProgress color="success" variant="determinate" value={progress} />
        </Box>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="0" direction="horizontal" type="column">
            {(provided) => (
              <Stack
                {...provided.droppableProps}
                ref={provided.innerRef}
                spacing={3}
                direction="row"
                justifyContent="space-evenly"
                alignItems="flex-start"
                sx={{
                  width: 1,
                  height: 1,
                  overflowY: 'hidden',
                  ...hideScrollbarX,
                }}
              >
                <AppTopAuthors title="CI Feature Column" cWidth={0.25} list={featureColumns} />

                {!board.columnOrder.length ? (
                  <SkeletonKanbanColumn />
                ) : (
                  board.columnOrder.map((columnId, index) => {
                    console.log(board.columns[columnId]);
                    return (
                      <KanbanColumn
                        index={index}
                        key={columnId}
                        column={board.columns[columnId]}
                        cards={board.cards}
                      />
                    );
                  })
                )}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
        <Link to={PATH_APP.general.variableMapping}>
          <LoadingButton color="info" size="medium" variant="contained">
            Next
          </LoadingButton>
        </Link>
      </Container>
    </>
  );
}
